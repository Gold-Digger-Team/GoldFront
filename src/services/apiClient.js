const normalizeBaseUrl = (value) => {
  if (!value) return ''
  return value.trim().replace(/\/+$/, '')
}

const ensureLeadingSlash = (path) => (path.startsWith('/') ? path : `/${path}`)

const logRequest = (label, method, url, extra = {}) => {
  if (import.meta.env.DEV) {
    console.debug(`[${label}] ${method} ${url}`, extra)
  }
}

const logError = (label, method, url, error, extra = {}) => {
  console.error(`[${label}] Request failed (${method} ${url})`, error, extra)
}

const createApiClient = (envKey, label) => {
  const rawBaseUrl = import.meta.env[envKey]
  const baseUrl = normalizeBaseUrl(rawBaseUrl) || ''

  const resolveUrl = (path = '') => {
    if (!path) {
      if (!baseUrl) {
        throw new Error(`API base URL is not configured. Set ${envKey} in your environment.`)
      }
      return baseUrl
    }

    if (/^https?:\/\//i.test(path)) {
      return path
    }

    if (!baseUrl) {
      throw new Error(`API base URL is not configured. Set ${envKey} in your environment.`)
    }

    return `${baseUrl}${ensureLeadingSlash(path)}`
  }

  const clientFetch = (path, options = {}) => {
    const url = resolveUrl(path)
    const method = (options.method || 'GET').toUpperCase()
    const finalOptions = {
      ...options,
      credentials: options.credentials ?? 'include'
    }

    logRequest(label, method, url, options.logContext)

    return fetch(url, finalOptions)
      .then((response) => {
        if (!response.ok) {
          console.warn(
            `[${label}] Received ${response.status} for ${method} ${url}`,
            options.logContext
          )
        }
        return response
      })
      .catch((error) => {
        logError(label, method, url, error, options.logContext)
        throw error
      })
  }

  return {
    baseUrl,
    resolveUrl,
    fetch: clientFetch
  }
}

const coreApiClient = createApiClient('VITE_API_BASE_URL', 'Core API')

export const apiBaseUrl = coreApiClient.baseUrl
export const resolveApiUrl = coreApiClient.resolveUrl
export const apiFetch = coreApiClient.fetch

const predictionApiClient = createApiClient('VITE_PREDICTION_API_BASE_URL', 'Prediction API')

export const predictionApiBaseUrl = predictionApiClient.baseUrl
export const resolvePredictionApiUrl = predictionApiClient.resolveUrl
export const predictionApiFetch = predictionApiClient.fetch

export const ensureSuccess = async (response, { allowedStatuses = [] } = {}) => {
  if (response.ok || allowedStatuses.includes(response.status)) {
    return response
  }

  const statusText = response.statusText || 'Unknown status'
  const error = new Error(`Request failed: ${response.status} ${statusText}`)
  error.response = response
  throw error
}

export const parseJsonSafely = async (response) => {
  try {
    return await response.json()
  } catch (error) {
    console.warn('[API] Failed to parse JSON response', error)
    return null
  }
}

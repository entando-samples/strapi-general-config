export const getKeycloakToken = () => {
    if (window && window.entando && window.entando.keycloak && window.entando.keycloak.authenticated) {
        return window.entando.keycloak.token
    }
    return ''
}

export const isAuthenticated = props => {
    const {keycloak} = props
    return keycloak.initialized && keycloak.authenticated
}

export const authenticationChanged = (props, prevProps) => {
    const authenticated = isAuthenticated(props)
    const changedAuth = prevProps.keycloak.authenticated !== authenticated
    return authenticated && changedAuth
}

export const getUserName = async () => {
    if (window.entando && window.entando.keycloak && window.entando.keycloak.tokenParsed) {
        const userInfo = window.entando.keycloak.tokenParsed;
        return userInfo.preferred_username;
    } else {
        return ""
    }
}

export const hasKeycloakClientRole = clientRole => {
    if (getKeycloakToken()) {
        const {resourceAccess} = window.entando.keycloak
        if (resourceAccess) {
            for (const client in resourceAccess) {
                const item = resourceAccess[client]
                if (item.roles && item.roles.includes(clientRole)) {
                    return true
                }
            }
        }
    }
    return false
}

export const getDefaultOptions = () => {
    const token = getKeycloakToken()
    if (!token) return {}
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}

export const isCurrentUserAuthenticated = () => {
   return window.entando && window.entando.keycloak && window.entando.keycloak.authenticated;
}

export const isCurrentUserAssignedAPreferredName = () => {
    return window.entando.keycloak.tokenParsed && window.entando.keycloak.tokenParsed.preferred_username;
}
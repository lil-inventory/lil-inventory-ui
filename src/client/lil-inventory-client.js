export class LilInventoryClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

        let refreshInfo = getRefreshInfo()
        if(refreshInfo!==null) {
            this.refreshToken = refreshInfo.refresh_token
            this.experation = refreshInfo.experation
        }
    }

    login(username, password) {
        const path = "/auth/token"
        
        let url = this._url(path, {
            grant_type: 'password',
            username: username,
            password: password
        })

        let promise = this._request(url, {
            method: 'POST',
            credentials: 'include'
        }, false)

        return this._setAccessCredentials(promise)
    }

    refresh(token = this.refreshToken) {
        const path = "/auth/token"

        let url = this._url(path, {
            grant_type: 'refresh_token',
            refresh_token: token

        })

        let promise = this._request(url, {
            method: 'POST',
            credentials: 'include'
        }, false)

        return this._setAccessCredentials(promise)
    }

    getInventories() {
        const path = "/inventory"
        let url = this._url(path)

        return this._request(url, {
            method: 'GET',
            credentials: 'include'
        })
    }

    getInventory(inventoryId) {
        const path = `/inventory/${inventoryId}`
        let url = this._url(path)

        return this._request(url, {
            method: 'GET',
            credentials: 'include'
        })
    }

    createInventory(name, isPrivate = false) {
        const path = "/inventory"
        let url = this._url(path, {
            name: name,
            private: isPrivate
        })

        return this._request(url, {
            method: 'POST',
            credentials: 'include'
        })
    }

    deleteInventory(inventoryId) {
        const path = `/inventory/${inventoryId}`
        let url = this._url(path)

        return this._request(url, {
            method: 'DELETE',
            credentials: 'include'
        }, undefined, false)
    }

    getNavigation(inventoryId, groupId, assetId) {
        if(!groupId && !assetId) {
            return this.getNavigationRoot(inventoryId)
        } else if (groupId && !assetId) {
            return this.getNavigationGroup(inventoryId, groupId)
        } else if (assetId && !groupId) {
            return this.getNavigationAsset(inventoryId, assetId)
        } else {
            throw "both groupid and assetid defined"
        }
    }

    getNavigationRoot(inventoryId) {
        if(!inventoryId) {
            throw "inventory not defined"
        }

        const path = `/inventory/${inventoryId}/navigation`
        let url = this._url(path)

        return this._request(url, {
            method: 'GET',
            credentials: 'include'
        })
    }

    getNavigationGroup(inventoryId, groupId) {
        const path = `/inventory/${inventoryId}/navigation/group/${groupId}`
        let url = this._url(path)

        return this._request(url, {
            method: 'GET',
            credentials: 'include'
        })
    }

    getNavigationAsset(inventoryId, assetId) {
        const path = `/inventory/${inventoryId}/navigation/asset/${assetId}`
        let url = this._url(path)

        return this._request(url, {
            method: 'GET',
            credentials: 'include'
        })
    }

    createGroup(inventoryId, name, parentGroupId=null) {
        const path = `/inventory/${inventoryId}/group`
        let url = this._url(path, {
            parentGroupId: parentGroupId,
            name: name
        })

        return this._request(url, {
            method: 'POST',
            credentials: 'include'
        })
    }

    deleteGroup(inventoryId, groupId) {
        const path = `/inventory/${inventoryId}/group/${groupId}`
        let url = this._url(path)

        return this._request(url, {
            method: 'DELETE',
            credentials: 'include'
        }, undefined, false)
    }

    createAsset(inventoryId, groupId, name, barcode) {
        const path = `/inventory/${inventoryId}/assets`
        let url = this._url(path)

        return this._request(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                name: name,
                barcode: barcode,
                groupId: groupId
            })
        }, undefined, false)
    }
    
    deleteAsset(inventoryId, assetId) {
        const path = `/inventory/${inventoryId}/assets/${assetId}`
        let url = this._url(path)

        return this._request(url, {
            method: 'DELETE',
            credentials: 'include'
        }, undefined, false)
    }

    /**
     * constructs a url
     * @param {String} path
     * @param {JSON} params 
     */
    _url(path, params={}) {
        let query = Object.keys(params)
            .filter(k => params[k]!=null)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        
        return this.baseUrl + path + (query==='' ? '' : '?' + query)
    }

    /**
     * Constructs the requests and formats the response
     * 
     * @param {url} string
     * @param {options} JSON
     * @param {canRefresh} boolean if true, automatically refresh the session when needed
     */
    _request(url, options, canRefresh = true, hasBody = true) {

        if(canRefresh && this.experation!=null && this.experation <= Date.now()) {
            // attempt refresh
            
            return this.refresh().then(r => {
                
                if(r.status==200) {
                    // Continue with request if refreshing was successful
                    return fetch(url, options).then(r =>  r.json().then(data => ({
                        status: r.status,
                        body: data
                    })))
                } else {
                    // Return error if unsuccessful
                    return {status: r.status}
                }
            })
        } else {
            return fetch(url, options).then(r =>  {
                if(hasBody && r.status==200) {
                    return r.json().then(data => ({
                        status: r.status,
                        body: data
                    }))
                } else {
                    return {status: r.status}
                }
            })
        }
    }

    /**
     * 
     * @param {Promise<{status: Number, body: any}>} promise 
     * @returns 
     */
    _setAccessCredentials(promise) {
        return promise.then(req => {
            if(req.status!=200) {
                return req
            }

            setAccessCredentials(req.body)
            let refreshInfo = getRefreshInfo()
            
            if(refreshInfo==null) {
                throw new Error("unexpected state: refresh info is exspected to be defined")
            } else {
                this.refreshToken = refreshInfo.refresh_token
                this.experation = refreshInfo.experation
            }

            return req
        })
    }
}

const ACCESS_TOKEN_KEY = "INVENTORY_TOKEN"  // Must match backend
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN"

function setAccessCredentials(accessToken) {
    document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken.access_token}`
    sessionStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify({
        refresh_token: accessToken.refresh_token,
        experation: Date.now() + accessToken.expires_in - 30000 // expire 30 seconds early
    }))
}

function getRefreshInfo() {
    let refreshStr = sessionStorage.getItem(REFRESH_TOKEN_KEY)
    return refreshStr==null ? null : JSON.parse(refreshStr)
}

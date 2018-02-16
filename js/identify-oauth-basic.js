require([
    'esri/portal/Portal',
    'esri/identity/OAuthInfo',
    'esri/identity/IdentityManager',
    'esri/portal/PortalQueryParams',
    'dojo/domReady!'
], function(Portal, OAuthInfo, esriId, PortalQueryParams) {

    var personalPanelElement = document.getElementById('personalizedPanel'),
        anonPanelElement = document.getElementById('anonymousPanel'),
        userIdElement = document.getElementById('userId'),
        info = new OAuthInfo({
            // Swap this ID out with registered application ID
            appId: 'mRZlrGqWd5ezpVFM',
            // Uncomment the next line and update if using your own portal
            // portalUrl: 'https://<host>:<port>/arcgis' | default: https://www.arcgis.com
            // Uncomment the next line to prevent the user's signed in state from being shared with other apps on the same domain with the same authNamespace value.
            // authNamespace: 'portal_oauth_inline',
            popup: false
        });

    esriId.registerOAuthInfos([info]);

    esriId.checkSignInStatus(`${info.portalUrl}/sharing`).then(
        function() {
            displayItems();
        }
    ).otherwise(
        function() {
            // Anonymous view
            anonPanelElement.style.display = 'block';
            personalPanelElement.style.display = 'none';
        }
    );

    document.getElementById('sign-in').addEventListener('click', function() {
        // user will be redirected to OAuth Sign In page
        esriId.getCredential(`${info.portalUrl}/sharing`);
    });

    document.getElementById('sign-out').addEventListener('click', function() {
        esriId.destroyCredentials();
        window.location.reload();
    });

    function displayItems() {

        var portal = new Portal();
        // Setting authMode to immediate signs the user in once loaded
        portal.authMode = 'immediate';
        // Once loaded, user is signed in
        portal.load().then(function() {
            // Create query parameters for the portal search
            var queryParams = new PortalQueryParams({
                query: `owner:${portal.user.username}`,
                sortField: 'numViews',
                sortOrder: 'desc',
                num: 20
            });

            userIdElement.innerHTML = portal.user.username;
            anonPanelElement.style.display = 'none';
            personalPanelElement.style.display = 'block';

            // Query the items based on the queryParams created from portal above
            portal.queryItems(queryParams).then(createGallery);
        });
    }

    function createGallery(items) {
        var htmlFragment = '';

        items.results.forEach(function(item) {
            htmlFragment += (
                '<div class="esri-item-container">' +
                (item.thumbnailUrl ?
                    `<div class="esri-image"
                          style="background-image:url(${item.thumbnailUrl});">
                    </div>`:
                    `<div class="esri-image esri-null-image">
                        Thumbnail not available
                    </div>`
                ) +
                (item.title ?
                    '<div class="esri-title">' + (item.title || '') + '</div>' :
                    '<div class="esri-title esri-null-title">Title not available</div>'
                ) +
                '</div>');
            });
            document.getElementById('itemGallery').innerHTML = htmlFragment;
        }
    });

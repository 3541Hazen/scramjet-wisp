# Golden Eagle Wisp Server

This is the WebSocket backend for Golden Eagle Proxy. It runs as a Docker web service.

## SnapDeploy deployment

1. Sign in to SnapDeploy and choose **Deploy from GitHub**.
2. Select `3541Hazen/scramjet-wisp` and branch `main`.
3. Choose **Dockerfile** deployment. SnapDeploy will use the root `Dockerfile`.
4. Set the container port to `8080` and the health check path to `/health`.
5. Deploy and copy the generated `https://...containers.snapdeploy.app` URL.
6. Set `WISP_URL` in the frontend build environment to that URL with `https://` replaced by `wss://` and `/wisp/` appended.

For example: `wss://your-service.containers.snapdeploy.app/wisp/`.

## Northflank deployment

1. Create a **Combined Service** from this GitHub repository and select the `main` branch.
2. Set the build type to **Dockerfile** and set the Dockerfile path to `Dockerfile`.
3. Add a public HTTP port `8080`. Enable WebSockets for that port if Northflank shows the option.
4. Set the health check path to `/health` and deploy the service.
5. Copy the service URL and append `/wisp/`, using `wss://` for the frontend value. For example: `wss://your-service.northflank.app/wisp/`.
6. Set that value as `WISP_URL` in the frontend's Netlify or Cloudflare Pages build environment, then redeploy the frontend.

Northflank supplies `PORT` when configured; the server also defaults to port `8080`. The `/health` endpoint should return `Wisp server is running` after deployment.

## Render deployment

1. Create a new public GitHub repository and upload the contents of this folder.
2. In Render, select **New > Web Service** and connect the repository.
3. Select **Docker** as the runtime. Render will use the included `Dockerfile`.
4. Deploy with the default settings. Render supplies the `PORT` environment variable automatically.
5. Copy the deployed URL and append `/wisp/`, using `wss://` for the frontend value. For example: `wss://golden-eagle-wisp.onrender.com/wisp/`.
6. Set that value as `WISP_URL` in the frontend's Netlify or Cloudflare Pages build environment, then redeploy the frontend.

The `/health` endpoint should return `Wisp server is running` after deployment.

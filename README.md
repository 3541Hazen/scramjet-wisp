# Golden Eagle Wisp Server

This is the WebSocket backend for Golden Eagle Proxy. It is designed to run as a Render Web Service.

## Render deployment

1. Create a new public GitHub repository and upload the contents of this folder.
2. In Render, select **New > Web Service** and connect the repository.
3. Select **Docker** as the runtime. Render will use the included `Dockerfile`.
4. Deploy with the default settings. Render supplies the `PORT` environment variable automatically.
5. Copy the deployed URL and append `/wisp/`, using `wss://` for the frontend value. For example: `wss://golden-eagle-wisp.onrender.com/wisp/`.
6. Set that value as `WISP_URL` in the frontend's Netlify or Cloudflare Pages build environment, then redeploy the frontend.

The `/health` endpoint should return `Wisp server is running` after deployment.

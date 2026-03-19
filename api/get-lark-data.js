// api/get-lark-data.js
export default async function handler(req, res) {
  // Use environment variables (Set these in Vercel Dashboard)
  const APP_ID = process.env.LARK_APP_ID;
  const APP_SECRET = process.env.LARK_APP_SECRET;
  const APP_TOKEN = process.env.LARK_APP_TOKEN; 
  const TABLE_ID = process.env.LARK_TABLE_ID;

  try {
    // 1. Get Access Token
    const authResponse = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET })
    });
    const authData = await authResponse.json();
    const token = authData.tenant_access_token;

    // 2. Fetch Records
    const recordsResponse = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const recordsData = await recordsResponse.json();

    // 3. Return data to your frontend
    res.status(200).json(recordsData.data.items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Lark data" });
  }
}

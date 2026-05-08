import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirect = url.searchParams.get("redirect") || "/dashboard";

  // This page reads the cookies set by the callback, puts them into Zustand store, then redirects
  const html = `
<!DOCTYPE html>
<html>
<head><title>Signing in...</title></head>
<body style="background:#050510;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;">
  <div style="text-align:center;">
    <p>Completing sign in...</p>
  </div>
  <script>
    try {
      function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
      }
      function deleteCookie(name) {
        document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }

      const token = getCookie('google_auth_token');
      const userStr = getCookie('google_auth_user');
      const isNew = getCookie('google_auth_is_new') === 'true';

      if (token && userStr) {
        const user = JSON.parse(userStr);
        // Set into Zustand persisted store (localStorage)
        const storeData = {
          state: { user, token, isLoading: false, isNewUser: isNew },
          version: 0
        };
        localStorage.setItem('nexora-auth', JSON.stringify(storeData));
      }

      // Clean up cookies
      deleteCookie('google_auth_token');
      deleteCookie('google_auth_user');
      deleteCookie('google_auth_is_new');

      window.location.href = '${redirect}';
    } catch(e) {
      console.error(e);
      window.location.href = '/login?error=auth_setup_failed';
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define allowed admin credentials
const ADMIN_CREDENTIALS = {
  username: "Admin",
  password: "Vaishaly", // In production, use secure passwords and store in environment variables
};

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { username, password } = body;

    console.log("Login attempt:", { username });

    // Validate admin credentials
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      console.log("Admin login successful");
      return new Response(
        JSON.stringify({
          success: true,
          admin: {
            id: "admin-1",
            username: ADMIN_CREDENTIALS.username,
            role: "admin",
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } else {
      console.log("Admin login failed: Invalid credentials");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid credentials" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});

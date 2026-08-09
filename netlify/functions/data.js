// Netlify serverless function acting as the shared backend for the
// attendance app. Uses Netlify Blobs — a key/value store built into every
// Netlify site, no external database or account needed.
//
// GET  /.netlify/functions/data   -> returns { users: [...], attendance: [...] }
// POST /.netlify/functions/data   -> body: { users, attendance } -> saves it

import { getStore } from '@netlify/blobs';

const EMPTY_STATE = { users: [], attendance: [] };

export default async (req, context) => {
  const store = getStore('ridge-attendance');

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method === 'GET') {
    const state = (await store.get('state', { type: 'json' })) || EMPTY_STATE;
    return new Response(JSON.stringify(state), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const state = {
        users: Array.isArray(body.users) ? body.users : [],
        attendance: Array.isArray(body.attendance) ? body.attendance : [],
      };
      await store.setJSON('state', state);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: String(err) }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
};

export const config = {
  path: '/.netlify/functions/data',
};

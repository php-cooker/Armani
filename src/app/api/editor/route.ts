export async function GET() {
  const res = await fetch(
    "https://icones.js.org/collections/heroicons-solid.json",
    {}
  );
  const data = await res.json();
  return Response.json({ data });
}

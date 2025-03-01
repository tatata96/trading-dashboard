export function formatPrice(price: string | number, decimals: number = 8): string {
  if (!price) return "0";

  // Convert to number if it's a string
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Format with the specified decimal places and remove trailing zeros
  return numericPrice.toFixed(decimals).replace(/\.?0+$/, "");
}

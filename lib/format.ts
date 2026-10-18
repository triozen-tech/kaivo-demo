/** Money is stored as integer baisa (1 OMR = 1000 baisa) and shown as "OMR 7.500". */
const fmt = new Intl.NumberFormat("en-OM", { style: "currency", currency: "OMR" });
/** Same text on server and client: whitespace is normalised to a no-break space. */
export const omr = (baisa: number) => fmt.format(baisa / 1000).replace(/\s/g, "\u00a0");

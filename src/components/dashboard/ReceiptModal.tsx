"use client";

import { Icon } from "../shared/Icon";
import { CartItem, Customer } from "@/lib/types";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "momo" | "card";
  amountGiven?: number;
  change?: number;
  customer?: Customer | null;
}

const METHOD_LABEL: Record<string, string> = {
  cash: "Cash",
  momo: "Mobile Money (Momo)",
  card: "Credit / Debit Card",
};

function buildReceiptHTML(props: Omit<ReceiptModalProps, "isOpen" | "onClose">) {
  const {
    cartItems,
    subtotal,
    tax,
    total,
    paymentMethod,
    amountGiven,
    change,
    customer,
  } = props;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const receiptNo = `RCP-${Date.now().toString().slice(-6)}`;

  const itemRows = cartItems
    .map((item) => {
      const name = item.name.length > 20 ? item.name.slice(0, 19) + "…" : item.name;
      const price = `GH${(item.price * item.qty).toFixed(2)}`;
      const qty = `x${item.qty}`;
      // Pad to fill ~32 chars
      const left = `${qty} ${name}`;
      const padding = Math.max(1, 32 - left.length - price.length);
      return `<div class="row"><span>${left}</span><span>${price}</span></div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Receipt</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 4mm 6mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      color: #000;
      width: 68mm;
      line-height: 1.5;
    }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .large { font-size: 14px; }
    .xlarge { font-size: 16px; }
    .divider {
      border-top: 1px dashed #000;
      margin: 6px 0;
    }
    .divider-solid {
      border-top: 1px solid #000;
      margin: 6px 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }
    .row span:first-child { flex: 1; }
    .row span:last-child { text-align: right; white-space: nowrap; }
    .sub { font-size: 10px; color: #333; padding-left: 12px; }
    .total-row {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 13px;
      margin: 4px 0;
    }
    .section { margin: 5px 0; }
    .footer { text-align: center; margin-top: 8px; font-size: 10px; }
  </style>
</head>
<body>
  <!-- Store header -->
  <div class="center bold large">MY STORE</div>
  <div class="center" style="font-size:10px;">123 Commerce Street, Accra</div>
  <div class="center" style="font-size:10px;">Tel: 024-000-0000</div>

  <div class="divider-solid"></div>

  <!-- Receipt meta -->
  <div class="section">
    <div class="row"><span>Receipt #</span><span>${receiptNo}</span></div>
    <div class="row"><span>Date</span><span>${dateStr}</span></div>
    <div class="row"><span>Time</span><span>${timeStr}</span></div>
    ${customer ? `<div class="row"><span>Customer</span><span>${customer.name}</span></div>` : ""}
  </div>

  <div class="divider"></div>

  <!-- Items -->
  <div class="section bold" style="margin-bottom:3px;">ITEMS</div>
  <div class="section">
    ${itemRows}
  </div>

  <!-- Item sizes -->
  ${cartItems
    .filter((i) => i.size)
    .map(
      (i) =>
        `<div class="sub">${i.name.slice(0, 18)}: ${i.size}${i.color ? ` / ${i.color}` : ""}</div>`,
    )
    .join("")}

  <div class="divider"></div>

  <!-- Totals -->
  <div class="section">
    <div class="row"><span>Subtotal</span><span>GH₵${subtotal.toFixed(2)}</span></div>
    <div class="row"><span>Tax</span><span>No tax</span></div>
  </div>

  <div class="divider-solid"></div>

  <div class="total-row">
    <span>TOTAL</span>
    <span>GH₵${total.toFixed(2)}</span>
  </div>

  <div class="divider-solid"></div>

  <!-- Payment -->
  <div class="section">
    <div class="row"><span>Payment</span><span>${METHOD_LABEL[paymentMethod]}</span></div>
    ${
      paymentMethod === "cash" && amountGiven != null
        ? `<div class="row"><span>Amount Given</span><span>GH₵${amountGiven.toFixed(2)}</span></div>
           <div class="row bold"><span>Change</span><span>GH₵${(change ?? 0).toFixed(2)}</span></div>`
        : ""
    }
  </div>

  <div class="divider-solid"></div>

  <!-- Footer -->
  <div class="footer">
    <div>*** Thank you for shopping! ***</div>
    <div>Please come again</div>
    <br/>
    <div>Powered by MyPOS</div>
  </div>
</body>
</html>`;
}

export const ReceiptModal = ({
  isOpen,
  onClose,
  ...receiptProps
}: ReceiptModalProps) => {
  if (!isOpen) return null;

  const {
    cartItems,
    subtotal,
    tax,
    total,
    paymentMethod,
    amountGiven,
    change,
    customer,
  } = receiptProps;

  const now = new Date();
  const receiptNo = `RCP-${Date.now().toString().slice(-6)}`;

  const handlePrint = () => {
    const html = buildReceiptHTML(receiptProps);
    const win = window.open("", "_blank", "width=340,height=600");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    // Small delay so styles render before print dialog opens
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <Icon name="Receipt" size={18} className="text-gray-500" />
              <span className="font-semibold text-slate-900">Receipt Preview</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* Receipt preview — styled to look like a thermal roll */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
            <div
              className="mx-auto bg-white shadow-md"
              style={{ width: "240px", fontFamily: "'Courier New', monospace", fontSize: "11px", lineHeight: "1.6", padding: "12px 10px", color: "#000" }}
            >
              {/* Store header */}
              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "14px" }}>MY STORE</div>
              <div style={{ textAlign: "center", fontSize: "10px" }}>123 Commerce Street, Accra</div>
              <div style={{ textAlign: "center", fontSize: "10px" }}>Tel: 024-000-0000</div>

              <div style={{ borderTop: "1px solid #000", margin: "6px 0" }} />

              {/* Meta */}
              <div style={{ fontSize: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Receipt #</span><span>{receiptNo}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Date</span>
                  <span>{now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Time</span>
                  <span>{now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                {customer && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Customer</span><span>{customer.name}</span>
                  </div>
                )}
              </div>

              <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

              {/* Items */}
              <div style={{ fontWeight: "bold", fontSize: "10px", marginBottom: "3px" }}>ITEMS</div>
              {cartItems.map((item) => (
                <div key={item.id}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>x{item.qty} {item.name.length > 16 ? item.name.slice(0, 15) + "…" : item.name}</span>
                    <span>GH₵{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                  {item.size && (
                    <div style={{ fontSize: "9px", color: "#555", paddingLeft: "10px" }}>
                      {item.size}{item.color ? ` / ${item.color}` : ""}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

              {/* Totals */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                <span>Subtotal</span><span>GH₵{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                <span>Tax</span><span>No tax</span>
              </div>

              <div style={{ borderTop: "1px solid #000", margin: "6px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "13px" }}>
                <span>TOTAL</span><span>GH₵{total.toFixed(2)}</span>
              </div>

              <div style={{ borderTop: "1px solid #000", margin: "6px 0" }} />

              {/* Payment */}
              <div style={{ fontSize: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Payment</span><span>{METHOD_LABEL[paymentMethod]}</span>
                </div>
                {paymentMethod === "cash" && amountGiven != null && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Amount Given</span><span>GH₵{amountGiven.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                      <span>Change</span><span>GH₵{(change ?? 0).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <div style={{ borderTop: "1px solid #000", margin: "8px 0 4px" }} />

              {/* Footer */}
              <div style={{ textAlign: "center", fontSize: "10px" }}>
                <div>*** Thank you for shopping! ***</div>
                <div>Please come again</div>
                <div style={{ marginTop: "6px", color: "#666" }}>Powered by MyPOS</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 py-4 border-t border-gray-100 flex gap-3 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="Printer" size={15} />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

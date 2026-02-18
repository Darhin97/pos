"use client";

import { useState } from "react";
import { Logo } from "../shared/Logo";
import { Icon } from "../shared/Icon";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  activePage: string;
  setPage: (page: string) => void;
  onLogout: () => void;
}

const ORDER_PAGES = ["orders", "orders/open-close", "orders/quotes", "orders/sale-history"];

export const Sidebar = ({ activePage, setPage, onLogout }: SidebarProps) => {
  const isInOrders = ORDER_PAGES.includes(activePage) || activePage.startsWith("orders/");
  const [ordersExpanded, setOrdersExpanded] = useState(isInOrders);

  const handleOrdersClick = () => {
    if (!ordersExpanded) {
      setOrdersExpanded(true);
      setPage("orders");
    } else {
      setOrdersExpanded(false);
    }
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-full hidden xl:flex">
      <div className="p-5 flex items-center gap-3">
        <Logo />
      </div>

      <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Main Menu
          </div>
          <ul className="space-y-0.5">
            <SidebarItem
              icon="PieChart"
              label="Overview"
              active={activePage === "overview"}
              onClick={() => setPage("overview")}
            />

            {/* Orders with sub-navigation */}
            <li className="cursor-pointer">
              <div
                onClick={handleOrdersClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                  isInOrders && activePage === "orders"
                    ? "bg-blue-600 text-white shadow-sm"
                    : isInOrders
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon
                  name="ShoppingCart"
                  size={18}
                  className={isInOrders ? "" : "group-hover:text-gray-700"}
                />
                <span className="font-medium text-sm flex-1">Orders</span>
                <Icon
                  name={ordersExpanded ? "ChevronDown" : "ChevronRight"}
                  size={14}
                  className={isInOrders ? "" : "group-hover:text-gray-700"}
                />
              </div>

              {ordersExpanded && (
                <ul className="mt-0.5 ml-4 pl-3 border-l border-gray-200 space-y-0.5">
                  <li
                    onClick={() => setPage("orders")}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                      activePage === "orders"
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <Icon name="ShoppingCart" size={15} />
                    Orders
                  </li>
                  <li
                    onClick={() => setPage("orders/open-close")}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                      activePage === "orders/open-close"
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <Icon name="ToggleRight" size={15} />
                    Open / Close
                  </li>
                  <li
                    onClick={() => setPage("orders/quotes")}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                      activePage === "orders/quotes"
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <Icon name="FileText" size={15} />
                    Quotes
                  </li>
                  <li
                    onClick={() => setPage("orders/sale-history")}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                      activePage === "orders/sale-history"
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <Icon name="History" size={15} />
                    Sale History
                  </li>
                </ul>
              )}
            </li>

            <SidebarItem
              icon="LayoutGrid"
              label="Categories"
              active={activePage === "categories"}
              onClick={() => setPage("categories")}
            />
            <SidebarItem
              icon="Tag"
              label="Promos"
              active={activePage === "promos"}
              onClick={() => setPage("promos")}
            />
            <SidebarItem
              icon="Wallet"
              label="Transaction"
              active={activePage === "transactions"}
              onClick={() => setPage("transactions")}
            />
          </ul>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Inventory
          </div>
          <ul className="space-y-0.5">
            <SidebarItem
              icon="Shirt"
              label="Products"
              active={activePage === "products"}
              onClick={() => setPage("products")}
            />
          </ul>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Report
          </div>
          <ul className="space-y-0.5">
            <SidebarItem
              icon="BarChart"
              label="Reporting"
              active={activePage === "reporting"}
              onClick={() => setPage("reporting")}
            />
          </ul>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Settings
          </div>
          <ul className="space-y-0.5">
            <SidebarItem
              icon="Users"
              label="User Management"
              active={activePage === "users"}
              onClick={() => setPage("users")}
            />
            <SidebarItem
              icon="CreditCard"
              label="Bank Account"
              active={activePage === "bank"}
              onClick={() => setPage("bank")}
            />
            <SidebarItem
              icon="LogOut"
              label="Logout"
              active={false}
              onClick={onLogout}
            />
          </ul>
        </div>
      </nav>

      <div className="p-3 mt-auto border-t border-gray-200">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Marily Vaccaro
            </p>
            <p className="text-xs text-gray-500 truncate">
              marilynvaccaro@changx.com
            </p>
          </div>
          <Icon name="Settings" size={16} className="text-gray-400" />
        </div>
      </div>
    </aside>
  );
};

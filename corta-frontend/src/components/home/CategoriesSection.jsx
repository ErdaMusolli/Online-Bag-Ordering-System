import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TOP = [
  { key: "all",    label: "All products",      to: "/store" },
  { key: "bags",   label: "Bags",              to: "/store?category=bags" },
  { key: "summer", label: "Summer Collection", to: "/store?category=summer-collection" },
];


const FABRICS = [
  { key: "corduroy",     label: "Corduroy bag" },
  { key: "denim",        label: "Denim bag" },
  { key: "linen",        label: "Linen" },
  { key: "canvas",       label: "Canvas" },
  { key: "bamboo",       label: "Bamboo" },
  { key: "cotton-linen", label: "Cotton Linen" },
  { key: "cotton cord",  label: "Cotton Cord"}
];

export default function CategoriesSection() {
  const { pathname, search } = useLocation();
  const qs = new URLSearchParams(search);
  const activeCat  = (qs.get("category") || "").toLowerCase();
  const activeFab  = (qs.get("fabric")   || "").toLowerCase();

  const [openDesktop, setOpenDesktop] = useState(false);
  const [openMobile,  setOpenMobile]  = useState(false);

  useEffect(() => {
    const open = !!activeFab;
    setOpenDesktop(open);
    setOpenMobile(open);
  }, [activeFab]);

  const isTopActive = (k) => {
    if (k === "all")    return pathname === "/store" && !activeCat && !activeFab;
    if (k === "bags")   return activeCat === "bags";
    if (k === "summer") return activeCat === "summer-collection";   
    return false;
  };

  return (
    <aside>
      <style>{`
        .chips { display:flex; gap:.5rem; flex-wrap:wrap; }
        .chip {
          display:inline-flex; align-items:center; gap:.3rem;
          padding:.5rem .9rem; border:1px solid #d6d6d6; border-radius:999px;
          background:#fff; color:#111!important; text-decoration:none!important;
        }
        .chip:hover { border-color:#111; }
        .chip.active { background:#111; color:#fff!important; border-color:#111; }
        .chip .check { display:none; }
        .chip.active .check { display:inline-block; }

        .link {
          color:#111!important; text-decoration:none!important;
          display:block; padding:.25rem 0;
        }
        .link.hover-underline:hover { text-decoration:underline!important; }
        .link.active { font-weight:700; }
        .link.always-underline { text-decoration:underline!important; }

        .fabric-toggle {
          background:none; border:0; padding:0; margin:0;
          color:#111; cursor:pointer; font:inherit;
          text-decoration:none; display:flex; align-items:center; gap:.4rem;
        }
        .fabric-toggle:hover { text-decoration:underline; }
        .caret { display:inline-block; transition:transform .15s ease; }
        .caret.open { transform:rotate(90deg); }
      `}</style>

      <h4 className="mb-2">Browse by</h4>
      <hr className="mt-0 mb-3" />

      <nav className="d-md-none">
        <div className="chips mb-2">
          {TOP.map(t => (
            <Link
              key={t.key}
              to={t.to}
              className={`chip ${isTopActive(t.key) ? "active" : ""}`}
              aria-current={isTopActive(t.key) ? "page" : undefined}
            >
              <span className="check">✓</span>{t.label}
            </Link>
          ))}
          <button
            type="button"
            className={`chip ${openMobile ? "active" : ""}`}
            onClick={() => setOpenMobile(o => !o)}
            aria-expanded={openMobile}
            aria-controls="fabric-chips"
          >
            Fabric
          </button>
        </div>

        {openMobile && (
          <div id="fabric-chips" className="chips">
            {FABRICS.map(f => (
              <Link
                key={f.key}
                to={`/store?fabric=${encodeURIComponent(f.key)}`}
                className={`chip ${activeFab === f.key ? "active" : ""}`}
              >
                <span className="check">✓</span>{f.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <nav className="d-none d-md-block">
        <Link
          to="/store"
          className={`link always-underline ${isTopActive("all") ? "active" : ""}`}
        >
          All products
        </Link>

        <Link
          to="/store?category=bags"
          className={`link hover-underline ${isTopActive("bags") ? "active" : ""}`}
        >
          Bags
        </Link>

        <Link
          to="/store?category=summer-collection"
          className={`link hover-underline ${isTopActive("summer") ? "active" : ""}`}
        >
          Summer Collection
        </Link>

        <div className="mt-2">
          <button
            type="button"
            className="fabric-toggle"
            onClick={() => setOpenDesktop(o => !o)}
            aria-expanded={openDesktop}
            aria-controls="fabric-list"
          >
            <span className={`caret ${openDesktop ? "open" : ""}`}>&#9656;</span>
            Fabric
          </button>

          {openDesktop && (
            <div id="fabric-list" className="mt-1">
              {FABRICS.map(f => (
                <Link
                  key={f.key}
                  to={`/store?fabric=${encodeURIComponent(f.key)}`}
                  className={`link hover-underline ${activeFab === f.key ? "active" : ""}`}
                  style={{ paddingLeft: ".9rem" }}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

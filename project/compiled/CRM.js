// Client CRM screen — table + selectable profile panel.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    Tabs,
    Input
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_STATUS = {
    lead: {
      tone: 'brand',
      label: 'Lead'
    },
    proposal: {
      tone: 'violet',
      label: 'Proposal sent'
    },
    negotiation: {
      tone: 'warning',
      label: 'Negotiation'
    },
    active: {
      tone: 'success',
      label: 'Active client'
    },
    completed: {
      tone: 'neutral',
      label: 'Completed'
    },
    lost: {
      tone: 'danger',
      label: 'Lost'
    }
  };
  const TF_CLIENTS_DATA = [{
    id: 1,
    company: 'Nova Skincare',
    contact: 'Amelia Stone',
    email: 'amelia@novaskin.co',
    country: '🇺🇸 United States',
    industry: 'E-commerce',
    status: 'active',
    value: '$12,400',
    source: 'Referral',
    site: 'novaskin.co',
    wa: '+1 415 555 0182'
  }, {
    id: 2,
    company: 'Orbit Inc.',
    contact: 'Daniel Wu',
    email: 'dan@orbit.io',
    country: '🇬🇧 United Kingdom',
    industry: 'SaaS',
    status: 'active',
    value: '$28,900',
    source: 'Inbound',
    site: 'orbit.io',
    wa: '+44 20 7946 0958'
  }, {
    id: 3,
    company: 'Mediva Health',
    contact: 'Priya Nair',
    email: 'priya@mediva.health',
    country: '🇦🇪 UAE',
    industry: 'Healthcare',
    status: 'negotiation',
    value: '$18,000',
    source: 'LinkedIn',
    site: 'mediva.health',
    wa: '+971 50 123 4567'
  }, {
    id: 4,
    company: 'Peak Fitness',
    contact: 'Marco Bianchi',
    email: 'marco@peakfit.com',
    country: '🇮🇹 Italy',
    industry: 'Fitness',
    status: 'active',
    value: '$9,200',
    source: 'Referral',
    site: 'peakfit.com',
    wa: '+39 06 5555 123'
  }, {
    id: 5,
    company: 'Lumen Cafe',
    contact: 'Sofia Reyes',
    email: 'sofia@lumencafe.com',
    country: '🇪🇸 Spain',
    industry: 'Hospitality',
    status: 'proposal',
    value: '$6,500',
    source: 'Instagram',
    site: 'lumencafe.com',
    wa: '+34 91 555 0199'
  }, {
    id: 6,
    company: 'Atlas Realty',
    contact: 'James Carter',
    email: 'james@atlasrealty.com',
    country: '🇺🇸 United States',
    industry: 'Real estate',
    status: 'lead',
    value: '$15,000',
    source: 'Cold outreach',
    site: 'atlasrealty.com',
    wa: '+1 212 555 0143'
  }, {
    id: 7,
    company: 'Verde Foods',
    contact: 'Lena Müller',
    email: 'lena@verdefoods.de',
    country: '🇩🇪 Germany',
    industry: 'CPG',
    status: 'completed',
    value: '$22,300',
    source: 'Referral',
    site: 'verdefoods.de',
    wa: '+49 30 5555 012'
  }];
  const TF_TIMELINE = [{
    icon: 'phone',
    tone: 'brand',
    text: 'Discovery call completed',
    time: 'Jun 18 · 32 min'
  }, {
    icon: 'file-text',
    tone: 'violet',
    text: 'Proposal v2 sent ($12,400/mo retainer)',
    time: 'Jun 15'
  }, {
    icon: 'mail',
    tone: 'success',
    text: 'Replied to onboarding email',
    time: 'Jun 12'
  }, {
    icon: 'calendar-check',
    tone: 'warning',
    text: 'Kickoff meeting scheduled',
    time: 'Jun 10'
  }];
  function Th({
    children,
    w
  }) {
    return /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'left',
        padding: '0 14px 10px',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        width: w
      }
    }, children);
  }
  function ClientRow({
    c,
    selected,
    onClick
  }) {
    const [hover, setHover] = React.useState(false);
    const s = TF_STATUS[c.status];
    return /*#__PURE__*/React.createElement("tr", {
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        cursor: 'pointer',
        background: selected ? 'var(--blue-50)' : hover ? 'var(--slate-50)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: c.company,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, c.company), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, c.site)))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, c.contact), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: s.tone,
      dot: true
    }, s.label)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, c.industry), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, c.country), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums'
      }
    }, c.value));
  }
  function ProfileField({
    icon,
    label,
    value
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 16,
      style: {
        color: 'var(--text-subtle)',
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        width: 76,
        flex: 'none'
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-medium)',
        textAlign: 'right',
        flex: 1
      }
    }, value));
  }
  function CRM() {
    const [selId, setSelId] = React.useState(1);
    const sel = TF_CLIENTS_DATA.find(c => c.id === selId);
    const s = TF_STATUS[sel.status];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Client CRM"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "38 clients · $112.7K in active retainers")), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user-plus",
      size: 16
    }), " Add client")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 320px',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 230
      }
    }, /*#__PURE__*/React.createElement(Input, {
      size: "sm",
      placeholder: "Search clients…",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 16
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 30,
        padding: '0 11px',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "filter",
      size: 15,
      style: {
        color: 'var(--text-muted)'
      }
    }), " Status"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, "7 of 38")), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(Th, null, "Company"), /*#__PURE__*/React.createElement(Th, null, "Contact"), /*#__PURE__*/React.createElement(Th, null, "Status"), /*#__PURE__*/React.createElement(Th, null, "Industry"), /*#__PURE__*/React.createElement(Th, null, "Country"), /*#__PURE__*/React.createElement(Th, {
      w: "90"
    }, "Value"))), /*#__PURE__*/React.createElement("tbody", null, TF_CLIENTS_DATA.map(c => /*#__PURE__*/React.createElement(ClientRow, {
      key: c.id,
      c: c,
      selected: c.id === selId,
      onClick: () => setSelId(c.id)
    }))))), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        overflow: 'hidden',
        position: 'sticky',
        top: 84
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--grad-hero)',
        padding: '20px 18px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: sel.company,
      size: "lg"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        letterSpacing: '-0.01em'
      }
    }, sel.company), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: s.tone,
      dot: true
    }, s.label)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 14
      }
    }, [['mail', 'Email'], ['message-circle', 'WhatsApp'], ['calendar-plus', 'Meeting']].map(([ic, l]) => /*#__PURE__*/React.createElement("button", {
      key: l,
      style: {
        flex: 1,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '8px 0',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 17,
      style: {
        color: 'var(--blue-600)'
      }
    }), " ", l)))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '6px 18px 14px'
      }
    }, /*#__PURE__*/React.createElement(ProfileField, {
      icon: "user",
      label: "Contact",
      value: sel.contact
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "at-sign",
      label: "Email",
      value: sel.email
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "globe",
      label: "Website",
      value: sel.site
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "target",
      label: "Source",
      value: sel.source
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "banknote",
      label: "Value",
      value: sel.value + '/mo'
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 18px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        marginBottom: 10
      }
    }, "Communication timeline"), /*#__PURE__*/React.createElement("div", null, TF_TIMELINE.map((t, i) => {
      const tones = {
        brand: 'var(--blue-600)',
        violet: 'var(--violet-500)',
        success: 'var(--green-500)',
        warning: 'var(--amber-500)'
      };
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          gap: 10,
          paddingBottom: i < TF_TIMELINE.length - 1 ? 12 : 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'var(--slate-50)',
          border: '1px solid var(--border-default)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tones[t.tone]
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: t.icon,
        size: 13
      })), i < TF_TIMELINE.length - 1 && /*#__PURE__*/React.createElement("span", {
        style: {
          width: 1.5,
          flex: 1,
          background: 'var(--border-default)',
          marginTop: 3
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          paddingBottom: 2
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-sm)',
          color: 'var(--text-body)',
          lineHeight: 1.4
        }
      }, t.text), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-subtle)',
          marginTop: 1
        }
      }, t.time)));
    }))))));
  }
  Object.assign(window, {
    CRM
  });
})();
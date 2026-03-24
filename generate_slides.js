const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaDollarSign, FaBuilding, FaCogs, FaExchangeAlt,
  FaChartLine, FaMoneyBillWave, FaCreditCard, FaUsers,
  FaShieldAlt, FaLink, FaFileInvoiceDollar, FaRoute,
  FaIdCard, FaDatabase, FaCalculator, FaQuestionCircle,
  FaServer,
} = require("react-icons/fa");

// ── Color Palette ──
const C = {
  primary: "0400F5", secondary: "49C2C1", text: "242E38", bg: "FFFFFF",
  purple: "7D49F2", lightPurple: "C3ABFD", lightTeal: "A3E0E0",
  gray: "92969B", lightGray: "E3E3E3",
  success: "38A169", warning: "D69E2E", error: "E53E3E",
};

// ── Layout (LAYOUT_WIDE 13.3 x 7.5) ──
const W = 13.3, ML = 0.6, CW = 12.1;
const TY = 0.35, TH = 1.1, CY = 1.55, CE = 6.70, FY = 7.0;
const TOTAL = 10;

// ── Icon helpers ──
function svgMarkup(Icon, color, sz = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Icon, { color, size: String(sz) })
  );
}
async function iconPng(Icon, color, sz = 256) {
  const buf = await sharp(Buffer.from(svgMarkup(Icon, color, sz))).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// ── Reusable helpers ──
const shadow = () => ({
  type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.12,
});

function addFooter(s, n) {
  s.addText("Gen Digital  |  Confidential", {
    x: ML, y: FY, w: 6, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: C.gray, valign: "middle",
  });
  s.addText(`${n} / ${TOTAL}`, {
    x: W - ML - 2, y: FY, w: 2, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: C.gray, align: "right", valign: "middle",
  });
}

function addTitle(s, txt) {
  s.addText(txt, {
    x: ML, y: TY, w: CW, h: TH,
    fontSize: 28, fontFace: "Calibri", bold: true, color: C.primary,
    valign: "top", margin: 0,
  });
}

// ── Main ──
async function main() {
  const ic = {
    dollarW: await iconPng(FaDollarSign, "#FFFFFF"),
    chartW: await iconPng(FaChartLine, "#FFFFFF"),
    moneyW: await iconPng(FaMoneyBillWave, "#FFFFFF"),
    creditW: await iconPng(FaCreditCard, "#FFFFFF"),
    exchangeW: await iconPng(FaExchangeAlt, "#FFFFFF"),
    buildingW: await iconPng(FaBuilding, "#FFFFFF"),
    shieldW: await iconPng(FaShieldAlt, "#FFFFFF"),
    usersW: await iconPng(FaUsers, "#FFFFFF"),
    invoiceW: await iconPng(FaFileInvoiceDollar, "#FFFFFF"),
    routeW: await iconPng(FaRoute, "#FFFFFF"),
    serverP: await iconPng(FaServer, "#0400F5"),
    buildingP: await iconPng(FaBuilding, "#0400F5"),
    idCardP: await iconPng(FaIdCard, "#0400F5"),
    dollarP: await iconPng(FaDollarSign, "#0400F5"),
    databaseP: await iconPng(FaDatabase, "#0400F5"),
    usersT: await iconPng(FaUsers, "#49C2C1"),
    linkT: await iconPng(FaLink, "#49C2C1"),
    cogsV: await iconPng(FaCogs, "#7D49F2"),
    calcV: await iconPng(FaCalculator, "#7D49F2"),
    questionW: await iconPng(FaQuestionCircle, "#D69E2E"),
  };

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Gauri Vasudeva";
  pres.title = "EB-EWA: Earned Wage Access";

  // ═══════════════════════════════════════════════════════════
  // SLIDE 1 — Cover
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.primary };
    s.addText(
      "EB-EWA: Giving Employees\nAccess to Wages They\u2019ve\nAlready Earned",
      {
        x: 1.0, y: 1.2, w: 10.5, h: 3.2,
        fontSize: 38, fontFace: "Calibri", bold: true, color: "FFFFFF",
        valign: "middle", margin: 0, lineSpacingMultiple: 1.1,
      }
    );
    s.addText("Earned Wage Access Within the Employment Benefits Suite", {
      x: 1.0, y: 4.7, w: 10.5, h: 0.6,
      fontSize: 20, fontFace: "Calibri", color: C.lightTeal, margin: 0,
    });
    s.addText("Gauri Vasudeva  |  March 2026", {
      x: 1.0, y: 5.4, w: 10.5, h: 0.5,
      fontSize: 14, fontFace: "Calibri", color: C.lightTeal, margin: 0,
    });
    s.addImage({ data: ic.dollarW, x: 10.8, y: 5.5, w: 1.8, h: 1.8, transparency: 85 });
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 2 — Problem (two-column)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitle(s, "Employees face cash-flow gaps and turn to high-cost credit between paydays");

    const bullets = [
      "Hourly and salaried employees face cash-flow gaps between paydays, leading to financial stress",
      "Workers rely on payday loans, overdraft fees, and other high-cost credit to bridge the gap",
      "Employers want to support employee financial wellness without increasing operational burden",
      "No EWA offering exists in the current EB benefits package \u2014 competitors like DailyPay are filling the gap",
    ];
    s.addText(
      bullets.map((b, i) => ({
        text: b,
        options: { bullet: true, breakLine: i < bullets.length - 1, color: C.text },
      })),
      {
        x: ML, y: CY, w: 5.6, h: 4.8,
        fontSize: 14, fontFace: "Calibri", color: C.text,
        valign: "top", lineSpacingMultiple: 1.4,
      }
    );

    // Right: Big emphasis card
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.55, y: CY, w: 6.15, h: 5.0,
      fill: { color: C.secondary }, shadow: shadow(),
    });
    s.addText("Payday\nGap", {
      x: 6.55, y: CY + 0.5, w: 6.15, h: 2.0,
      fontSize: 56, fontFace: "Calibri", bold: true, color: "FFFFFF",
      align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 0.9,
    });
    s.addText("The cash-flow gap between paydays", {
      x: 6.55, y: CY + 2.5, w: 6.15, h: 0.5,
      fontSize: 18, fontFace: "Calibri", color: C.lightTeal,
      align: "center", margin: 0,
    });
    s.addText("Employees wait 1\u20132 weeks between paychecks,\ncreating financial stress that drives them to\ncostly alternatives like payday loans", {
      x: 6.55, y: CY + 3.15, w: 6.15, h: 1.2,
      fontSize: 14, fontFace: "Calibri", color: "FFFFFF",
      align: "center", margin: 0, lineSpacingMultiple: 1.3,
    });
    addFooter(s, 2);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 3 — Solution (big statement + icons)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitle(s, "Earned Wage Access bridges the gap with a low-burden employer benefit");

    // Big statement box
    s.addShape(pres.shapes.RECTANGLE, {
      x: ML, y: CY, w: CW, h: 2.4,
      fill: { color: C.purple }, shadow: shadow(),
    });
    s.addText(
      "Employees access a portion of wages they\u2019ve already earned \u2014\nat low cost, with zero operational burden on the employer",
      {
        x: ML + 0.5, y: CY + 0.3, w: CW - 1.0, h: 1.8,
        fontSize: 22, fontFace: "Calibri", bold: true, color: "FFFFFF",
        align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.2,
      }
    );

    // 4 benefit badges
    const badgeY = CY + 2.8;
    const badgeW = 2.65, badgeGap = 0.4;
    const badgeStartX = ML + (CW - 4 * badgeW - 3 * badgeGap) / 2;
    const badges = [
      { icon: ic.dollarW, bg: C.primary, label: "Lower-Cost\nAlternative", desc: "Replaces payday loans\nand overdraft fees" },
      { icon: ic.buildingW, bg: C.secondary, label: "Zero Employer\nBurden", desc: "No operational overhead\nfor employers" },
      { icon: ic.shieldW, bg: C.purple, label: "Compliant\n& Secure", desc: "State eligibility and\nconsent management" },
      { icon: ic.usersW, bg: C.text, label: "Talent\nDifferentiator", desc: "Competitive edge in\nemployee benefits" },
    ];
    badges.forEach((b, i) => {
      const bx = badgeStartX + i * (badgeW + badgeGap);
      s.addShape(pres.shapes.OVAL, {
        x: bx + (badgeW - 0.6) / 2, y: badgeY, w: 0.6, h: 0.6,
        fill: { color: b.bg },
      });
      s.addImage({
        data: b.icon,
        x: bx + (badgeW - 0.32) / 2, y: badgeY + 0.14, w: 0.32, h: 0.32,
      });
      s.addText(b.label, {
        x: bx, y: badgeY + 0.7, w: badgeW, h: 0.55,
        fontSize: 13, fontFace: "Calibri", bold: true, color: C.text,
        align: "center", valign: "top", margin: 0,
      });
      s.addText(b.desc, {
        x: bx, y: badgeY + 1.3, w: badgeW, h: 0.6,
        fontSize: 11, fontFace: "Calibri", color: C.gray,
        align: "center", valign: "top", margin: 0, lineSpacingMultiple: 1.2,
      });
    });
    addFooter(s, 3);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 4 — Core Capabilities (icon grid)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitle(s, "Four core capabilities power the EWA experience end-to-end");

    const cardW = 2.8, cardH = 5.0, cardY = CY;
    const cols = [
      { x: 0.6, bg: C.primary, icon: ic.chartW,
        head: "Assess\nWages Earned",
        desc: "Integrate with payroll providers to compute accrued wages in real-time since the last payday" },
      { x: 3.7, bg: C.secondary, icon: ic.moneyW,
        head: "Offer\nAccess",
        desc: "Show available balance and guide employees through withdrawal options and fee structures" },
      { x: 6.8, bg: C.purple, icon: ic.creditW,
        head: "Disburse\nFunds",
        desc: "Send wages to checking accounts or debit cards via instant or standard ACH transfer" },
      { x: 9.9, bg: C.text, icon: ic.exchangeW,
        head: "Collect\nRepayment",
        desc: "Recover owed amounts at payday through employer-partnered deduction or intercept models" },
    ];

    cols.forEach((c) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: c.x, y: cardY, w: cardW, h: cardH,
        fill: { color: c.bg }, shadow: shadow(),
      });
      s.addImage({
        data: c.icon,
        x: c.x + (cardW - 0.6) / 2, y: cardY + 0.55, w: 0.6, h: 0.6,
      });
      s.addText(c.head, {
        x: c.x + 0.2, y: cardY + 1.45, w: cardW - 0.4, h: 0.85,
        fontSize: 16, fontFace: "Calibri", bold: true, color: "FFFFFF",
        align: "center", valign: "top", margin: 0,
      });
      s.addText(c.desc, {
        x: c.x + 0.25, y: cardY + 2.5, w: cardW - 0.5, h: 2.3,
        fontSize: 13, fontFace: "Calibri", color: "FFFFFF",
        align: "center", valign: "top", margin: 0, lineSpacingMultiple: 1.3,
      });
    });
    addFooter(s, 4);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 5 — Architecture diagram (7 systems)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitle(s, "Seven integrated systems deliver seamless wage access");

    const bw = 2.5, bh = 1.7, gap1 = 0.53;
    const r1y = CY;
    const r1startX = (W - 4 * bw - 3 * gap1) / 2;

    const row1 = [
      { label: "NM Interface\n(App)", icon: ic.usersT, clr: C.secondary },
      { label: "EWA\n(Core Backend)", icon: ic.cogsV, clr: C.purple },
      { label: "PayCon\n(Payroll Connector)", icon: ic.linkT, clr: C.secondary },
      { label: "Payroll\nProviders", icon: ic.serverP, clr: C.primary },
    ];
    row1.forEach((b, i) => {
      const bx = r1startX + i * (bw + gap1);
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: r1y, w: bw, h: bh,
        fill: { color: C.bg }, shadow: shadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: r1y, w: bw, h: 0.08,
        fill: { color: b.clr },
      });
      s.addImage({
        data: b.icon,
        x: bx + (bw - 0.4) / 2, y: r1y + 0.25, w: 0.4, h: 0.4,
      });
      s.addText(b.label, {
        x: bx + 0.1, y: r1y + 0.75, w: bw - 0.2, h: 0.8,
        fontSize: 12, fontFace: "Calibri", bold: true, color: C.text,
        align: "center", valign: "top", margin: 0,
      });
      if (i < 3) {
        s.addText("\u2192", {
          x: bx + bw, y: r1y + 0.5, w: gap1, h: 0.5,
          fontSize: 22, fontFace: "Calibri", color: C.gray,
          align: "center", valign: "middle", margin: 0,
        });
      }
    });

    // Row 2: supporting systems
    const r2y = r1y + bh + 0.6;
    const r2startX = (W - 3 * bw - 2 * gap1) / 2;

    // Down arrows connecting rows
    [0, 1, 2, 3].forEach((i) => {
      const cx = r1startX + i * (bw + gap1) + bw / 2;
      s.addText("\u2193", {
        x: cx - 0.2, y: r1y + bh + 0.05, w: 0.4, h: 0.45,
        fontSize: 18, fontFace: "Calibri", color: C.lightGray,
        align: "center", valign: "middle", margin: 0,
      });
    });

    const row2 = [
      { label: "EFMS / COLP\n(Employer Mgmt)", icon: ic.buildingP, clr: C.primary },
      { label: "LifeLock\n(Identity & KYC)", icon: ic.idCardP, clr: C.primary },
      { label: "MoneyLion\n(Advance Engine)", icon: ic.dollarP, clr: C.primary },
    ];
    row2.forEach((b, i) => {
      const bx = r2startX + i * (bw + gap1);
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: r2y, w: bw, h: bh,
        fill: { color: C.bg }, shadow: shadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: r2y, w: bw, h: 0.08,
        fill: { color: b.clr },
      });
      s.addImage({
        data: b.icon,
        x: bx + (bw - 0.4) / 2, y: r2y + 0.25, w: 0.4, h: 0.4,
      });
      s.addText(b.label, {
        x: bx + 0.1, y: r2y + 0.75, w: bw - 0.2, h: 0.8,
        fontSize: 12, fontFace: "Calibri", bold: true, color: C.text,
        align: "center", valign: "top", margin: 0,
      });
    });

    // Data flow bar
    const barY = r2y + bh + 0.3;
    const barH = CE - barY;
    if (barH > 0.3) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: ML, y: barY, w: CW, h: barH, fill: { color: C.lightGray },
      });
      s.addText("Data flows: Enrollment \u2192 Payroll ingestion \u2192 Eligibility computation \u2192 Disbursement \u2192 Repayment reconciliation", {
        x: ML + 0.3, y: barY + 0.05, w: CW - 0.6, h: barH - 0.1,
        fontSize: 12, fontFace: "Calibri", color: C.text,
        valign: "middle", margin: 0,
      });
    }
    addFooter(s, 5);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 6 — Employer Onboarding (swim-lane diagram)
  // Based on PDF page 6: Back-Office → EFMS → COLP → PayCon
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitle(s, "Employers onboard through verification, EB package, and payroll integration");

    // Swim-lane constants
    const hdrW = 1.4, hdrX = ML;
    const boxW = 2.9, boxH = 0.6, boxGap = 0.55;
    const col = [hdrX + hdrW + 0.1, 0, 0];
    col[1] = col[0] + boxW + boxGap;
    col[2] = col[1] + boxW + boxGap;
    const laneH = 0.95, laneGap = 0.18;
    const laneY = [CY, CY + laneH + laneGap, CY + 2 * (laneH + laneGap), CY + 3 * (laneH + laneGap)];
    const boxOff = (laneH - boxH) / 2;
    const laneClr = [C.primary, C.secondary, C.purple, C.text];
    const laneNames = ["Back-Office", "EFMS", "COLP", "PayCon"];
    const laneBg = ["F0F0FF", "F0FAFA", "F5F0FF", "F2F2F5"];

    // Draw lane backgrounds + headers
    laneNames.forEach((name, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: col[0] - 0.1, y: laneY[i], w: W - col[0], h: laneH,
        fill: { color: laneBg[i] },
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: hdrX, y: laneY[i], w: hdrW, h: laneH,
        fill: { color: laneClr[i] },
      });
      s.addText(name, {
        x: hdrX, y: laneY[i], w: hdrW, h: laneH,
        fontSize: 11, fontFace: "Calibri", bold: true, color: "FFFFFF",
        align: "center", valign: "middle", margin: 0,
      });
    });

    // Process boxes — grid[lane][col] = label
    const grid = [
      // Lane 0 (Back-Office): cols 0, 1, 2
      [{ c: 0, t: "Employer\nVerification" }, { c: 1, t: "EB Package Selection\n& Consent Mgmt" }, { c: 2, t: "Employee\nData Upload" }],
      // Lane 1 (EFMS): cols 1, 2
      [{ c: 1, t: "Employer\nEnrolment" }, { c: 2, t: "Employee\nCreation" }],
      // Lane 2 (COLP): cols 1, 2
      [{ c: 1, t: "EB Subscription\n(Employer)" }, { c: 2, t: "EB Subscription\n(Employee)" }],
      // Lane 3 (PayCon): col 2
      [{ c: 2, t: "Integration with\nPayroll Provider" }],
    ];

    grid.forEach((lane, li) => {
      lane.forEach((box) => {
        const bx = col[box.c], by = laneY[li] + boxOff;
        s.addShape(pres.shapes.RECTANGLE, {
          x: bx, y: by, w: boxW, h: boxH,
          fill: { color: C.bg }, line: { color: laneClr[li], width: 1.5 },
          rectRadius: 0.05,
        });
        s.addText(box.t, {
          x: bx + 0.05, y: by, w: boxW - 0.1, h: boxH,
          fontSize: 10, fontFace: "Calibri", bold: true, color: C.text,
          align: "center", valign: "middle", margin: 0,
        });
      });
    });

    // Horizontal arrows in lane 0
    [0, 1].forEach((ci) => {
      s.addText("\u2192", {
        x: col[ci] + boxW, y: laneY[0] + boxOff, w: boxGap, h: boxH,
        fontSize: 18, fontFace: "Calibri", color: laneClr[0],
        align: "center", valign: "middle", margin: 0,
      });
    });

    // Vertical arrows between lanes (col 1: lanes 0→1→2, col 2: lanes 0→1→2→3)
    [1, 2].forEach((ci) => {
      const maxLane = ci === 1 ? 2 : 3;
      for (let li = 0; li < maxLane; li++) {
        const ay = laneY[li] + boxOff + boxH;
        const ah = laneY[li + 1] + boxOff - ay;
        s.addText("\u2193", {
          x: col[ci] + boxW / 2 - 0.2, y: ay, w: 0.4, h: ah,
          fontSize: 14, fontFace: "Calibri", color: laneClr[li + 1],
          align: "center", valign: "middle", margin: 0,
        });
      }
    });

    // Bottom callout
    const noteY6 = laneY[3] + laneH + 0.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x: ML, y: noteY6, w: CW, h: 0.5, fill: { color: "FFF7ED" },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: ML, y: noteY6, w: 0.08, h: 0.5, fill: { color: C.warning },
    });
    s.addText("Off-boarding triggered by employment status changes reported via PayCon from the payroll provider.", {
      x: ML + 0.3, y: noteY6, w: CW - 0.5, h: 0.5,
      fontSize: 11, fontFace: "Calibri", color: C.text, valign: "middle", margin: 0,
    });
    addFooter(s, 6);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 7 — Employee Onboarding (swim-lane diagram)
  // Based on PDF page 7: NM Interface → EWA → LifeLock → MoneyLion
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitle(s, "Employees complete KYC, wallet setup, and consent for payroll data");

    const hdrW = 1.1, hdrX = ML;
    const bw7 = 1.6, bh7 = 0.55, bGap = 0.18;
    const startX7 = hdrX + hdrW + 0.1;
    const col7 = [];
    for (let i = 0; i < 6; i++) col7[i] = startX7 + i * (bw7 + bGap);
    const laneH7 = 0.9, laneGap7 = 0.2;
    const l7Y = [CY, CY + laneH7 + laneGap7, CY + 2 * (laneH7 + laneGap7), CY + 3 * (laneH7 + laneGap7)];
    const bOff7 = (laneH7 - bh7) / 2;
    const l7Clr = [C.secondary, C.purple, C.primary, C.text];
    const l7Names = ["NM Interface", "EWA", "LifeLock", "MoneyLion"];
    const l7Bg = ["F0FAFA", "F5F0FF", "F0F0FF", "F2F2F5"];

    // Lane backgrounds + headers
    l7Names.forEach((name, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: startX7 - 0.1, y: l7Y[i], w: W - startX7 + 0.1, h: laneH7,
        fill: { color: l7Bg[i] },
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: hdrX, y: l7Y[i], w: hdrW, h: laneH7,
        fill: { color: l7Clr[i] },
      });
      s.addText(name, {
        x: hdrX, y: l7Y[i], w: hdrW, h: laneH7,
        fontSize: 9, fontFace: "Calibri", bold: true, color: "FFFFFF",
        align: "center", valign: "middle", margin: 0,
      });
    });

    // NM Interface lane (lane 0): 6 boxes
    const nmBoxes = [
      "KYC / AML\nChecks", "Access\nCheck", "Wallet\nSetup",
      "Provide\nConsent", "Employee\nSetup", "Qualification\nCheck",
    ];
    nmBoxes.forEach((t, i) => {
      const bx = col7[i], by = l7Y[0] + bOff7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: by, w: bw7, h: bh7,
        fill: { color: C.bg }, line: { color: l7Clr[0], width: 1.5 },
        rectRadius: 0.05,
      });
      s.addText(t, {
        x: bx + 0.03, y: by, w: bw7 - 0.06, h: bh7,
        fontSize: 9, fontFace: "Calibri", bold: true, color: C.text,
        align: "center", valign: "middle", margin: 0,
      });
      if (i < 5) {
        s.addText("\u2192", {
          x: bx + bw7, y: by, w: bGap, h: bh7,
          fontSize: 14, fontFace: "Calibri", color: l7Clr[0],
          align: "center", valign: "middle", margin: 0,
        });
      }
    });

    // EWA lane (lane 1): col4 "Employee Setup", col5 "Qualification Data"
    [{ c: 4, t: "Employee\nSetup" }, { c: 5, t: "Qualification\nData" }].forEach((box) => {
      const bx = col7[box.c], by = l7Y[1] + bOff7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: by, w: bw7, h: bh7,
        fill: { color: C.bg }, line: { color: l7Clr[1], width: 1.5 },
        rectRadius: 0.05,
      });
      s.addText(box.t, {
        x: bx + 0.03, y: by, w: bw7 - 0.06, h: bh7,
        fontSize: 9, fontFace: "Calibri", bold: true, color: C.text,
        align: "center", valign: "middle", margin: 0,
      });
    });

    // LifeLock lane (lane 2): col0 "Customer Onboarded", col4 "Customer Creation"
    [{ c: 0, t: "Customer\nOnboarded" }, { c: 4, t: "Customer\nCreation" }].forEach((box) => {
      const bx = col7[box.c], by = l7Y[2] + bOff7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: by, w: bw7, h: bh7,
        fill: { color: C.bg }, line: { color: l7Clr[2], width: 1.5 },
        rectRadius: 0.05,
      });
      s.addText(box.t, {
        x: bx + 0.03, y: by, w: bw7 - 0.06, h: bh7,
        fontSize: 9, fontFace: "Calibri", bold: true, color: C.text,
        align: "center", valign: "middle", margin: 0,
      });
    });

    // MoneyLion lane (lane 3): col4 "(Lite) Account Creation"
    {
      const bx = col7[4], by = l7Y[3] + bOff7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: by, w: bw7, h: bh7,
        fill: { color: C.bg }, line: { color: l7Clr[3], width: 1.5 },
        rectRadius: 0.05,
      });
      s.addText("(Lite) Account\nCreation", {
        x: bx + 0.03, y: by, w: bw7 - 0.06, h: bh7,
        fontSize: 9, fontFace: "Calibri", bold: true, color: C.text,
        align: "center", valign: "middle", margin: 0,
      });
    }

    // Vertical arrows
    // col0: NM(0) → LifeLock(2) — skip EWA
    {
      const ay = l7Y[0] + bOff7 + bh7, ah = l7Y[2] + bOff7 - ay;
      s.addText("\u2193", {
        x: col7[0] + bw7 / 2 - 0.15, y: ay, w: 0.3, h: ah,
        fontSize: 14, fontFace: "Calibri", color: l7Clr[2],
        align: "center", valign: "middle", margin: 0,
      });
    }
    // col4: NM(0) → EWA(1) → LifeLock(2) → MoneyLion(3)
    [0, 1, 2].forEach((li) => {
      const ay = l7Y[li] + bOff7 + bh7, ah = l7Y[li + 1] + bOff7 - ay;
      s.addText("\u2193", {
        x: col7[4] + bw7 / 2 - 0.15, y: ay, w: 0.3, h: ah,
        fontSize: 12, fontFace: "Calibri", color: l7Clr[li + 1],
        align: "center", valign: "middle", margin: 0,
      });
    });
    // col5: EWA(1) → NM(0) — upward (qualification data returns)
    {
      const ay = l7Y[0] + bOff7 + bh7, ah = l7Y[1] + bOff7 - ay;
      s.addText("\u2191", {
        x: col7[5] + bw7 / 2 - 0.15, y: ay, w: 0.3, h: ah,
        fontSize: 12, fontFace: "Calibri", color: l7Clr[1],
        align: "center", valign: "middle", margin: 0,
      });
    }

    // Legend note
    const noteY7 = l7Y[3] + laneH7 + 0.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x: ML, y: noteY7, w: CW, h: 0.45, fill: { color: C.lightGray },
    });
    s.addText("Existing Instacash users are identified via SSN match in MoneyLion and notified of migration to EB-EWA.", {
      x: ML + 0.3, y: noteY7, w: CW - 0.5, h: 0.45,
      fontSize: 10, fontFace: "Calibri", color: C.text, valign: "middle", margin: 0,
    });
    addFooter(s, 7);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 8 — Eligibility (data flow strip + two-column)
  // Based on PDF page 9: NM → EWA → PayCon → Payroll Provider
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitle(s, "Real-time eligibility computation drives how much employees can access");

    // Data flow strip — 4 system actors
    const sysW = 2.4, sysH = 0.5, sysGap = 0.45;
    const sysStartX = (W - 4 * sysW - 3 * sysGap) / 2;
    const sysY = CY;
    const sysList = [
      { label: "NM Interface", clr: C.secondary },
      { label: "EWA", clr: C.purple },
      { label: "PayCon", clr: C.secondary },
      { label: "Payroll Provider", clr: C.primary },
    ];
    sysList.forEach((sys, i) => {
      const sx = sysStartX + i * (sysW + sysGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x: sx, y: sysY, w: sysW, h: sysH,
        fill: { color: sys.clr },
      });
      s.addText(sys.label, {
        x: sx, y: sysY, w: sysW, h: sysH,
        fontSize: 11, fontFace: "Calibri", bold: true, color: "FFFFFF",
        align: "center", valign: "middle", margin: 0,
      });
      if (i < 3) {
        s.addText("\u2192", {
          x: sx + sysW, y: sysY, w: sysGap, h: sysH,
          fontSize: 16, fontFace: "Calibri", color: C.gray,
          align: "center", valign: "middle", margin: 0,
        });
      }
    });
    // Flow description
    s.addText("Request eligibility  \u2192  Fetch payroll data  \u2192  Pull 90-day history  \u2192  Return & compute  \u2192  Eligibility result", {
      x: ML, y: sysY + sysH + 0.05, w: CW, h: 0.35,
      fontSize: 10, fontFace: "Calibri", color: C.gray, align: "center", valign: "middle", margin: 0,
    });

    // Two-column cards below
    const lx = ML, lw = 5.6, rx = 6.55, rw = 6.15;
    const cardsY = sysY + sysH + 0.5, cardsH = CE - cardsY;

    // Left — Data Inputs
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: cardsY, w: lw, h: cardsH, fill: { color: C.bg }, shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: cardsY, w: lw, h: 0.08, fill: { color: C.primary },
    });
    s.addImage({ data: ic.databaseP, x: lx + 0.25, y: cardsY + 0.2, w: 0.3, h: 0.3 });
    s.addText("Data Inputs", {
      x: lx + 0.65, y: cardsY + 0.15, w: 4.0, h: 0.4,
      fontSize: 16, fontFace: "Calibri", bold: true, color: C.primary,
      valign: "middle", margin: 0,
    });
    const inputs = [
      "90 days of payroll data via PayCon",
      "Hourly wages and hours worked per day",
      "Last payday date and paycheck frequency",
      "Employer configs (max %, ceiling amount)",
      "EWA product configs (fee structure, limits)",
      "State eligibility rules from LifeLock profile",
    ];
    s.addText(
      inputs.map((t, i) => ({
        text: t,
        options: { bullet: true, breakLine: i < inputs.length - 1, color: C.text },
      })),
      {
        x: lx + 0.25, y: cardsY + 0.7, w: lw - 0.5, h: cardsH - 0.9,
        fontSize: 12, fontFace: "Calibri", color: C.text,
        valign: "top", lineSpacingMultiple: 1.45, margin: 0,
      }
    );

    // Right — Computed Outputs
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: cardsY, w: rw, h: cardsH, fill: { color: C.bg }, shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: cardsY, w: rw, h: 0.08, fill: { color: C.secondary },
    });
    s.addImage({ data: ic.calcV, x: rx + 0.25, y: cardsY + 0.2, w: 0.3, h: 0.3 });
    s.addText("Computed Outputs", {
      x: rx + 0.65, y: cardsY + 0.15, w: 4.5, h: 0.4,
      fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary,
      valign: "middle", margin: 0,
    });
    const outputs = [
      "Average paycheck size",
      "Paycheck frequency",
      "Hourly rate (if applicable)",
      "Days since last paycheck",
      "Accrued wages since last paycheck",
      "Maximum EWA amount available",
      "Available amount net of used amount",
      "Expected paycheck net of amount owed",
    ];
    s.addText(
      outputs.map((t, i) => ({
        text: t,
        options: { bullet: true, breakLine: i < outputs.length - 1, color: C.text },
      })),
      {
        x: rx + 0.25, y: cardsY + 0.7, w: rw - 0.5, h: cardsH - 0.9,
        fontSize: 12, fontFace: "Calibri", color: C.text,
        valign: "top", lineSpacingMultiple: 1.3, margin: 0,
      }
    );
    addFooter(s, 8);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 9 — Repayment Models (vertical flow diagrams)
  // Based on PDF page 4: Deduction vs Intercept flows
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitle(s, "Two employer-partnered models handle repayment at payday");

    const lx = ML, lw = 5.6, rx = 6.55, rw = 6.15;
    const stepH = 0.5, stepGap = 0.2;
    const flowY = CY + 0.6;

    // Model headers
    s.addImage({ data: ic.invoiceW, x: lx + 0.15, y: CY + 0.05, w: 0.35, h: 0.35 });
    s.addText("Deduction Model", {
      x: lx + 0.6, y: CY, w: lw - 0.7, h: 0.45,
      fontSize: 18, fontFace: "Calibri", bold: true, color: C.primary,
      valign: "middle", margin: 0,
    });
    s.addImage({ data: ic.routeW, x: rx + 0.15, y: CY + 0.05, w: 0.35, h: 0.35 });
    s.addText("Intercept Model", {
      x: rx + 0.6, y: CY, w: rw - 0.7, h: 0.45,
      fontSize: 18, fontFace: "Calibri", bold: true, color: C.purple,
      valign: "middle", margin: 0,
    });

    // Flow step renderer
    function drawFlow(steps, baseX, baseW, clr, lightClr) {
      steps.forEach((txt, i) => {
        const sy = flowY + i * (stepH + stepGap);
        const bx = baseX + 0.15, bwInner = baseW - 0.3;
        s.addShape(pres.shapes.RECTANGLE, {
          x: bx, y: sy, w: bwInner, h: stepH,
          fill: { color: clr }, rectRadius: 0.05,
        });
        s.addText(`${i + 1}`, {
          x: bx + 0.05, y: sy, w: 0.35, h: stepH,
          fontSize: 14, fontFace: "Calibri", bold: true, color: lightClr,
          align: "center", valign: "middle", margin: 0,
        });
        s.addText(txt, {
          x: bx + 0.4, y: sy, w: bwInner - 0.5, h: stepH,
          fontSize: 12, fontFace: "Calibri", color: "FFFFFF",
          valign: "middle", margin: 0,
        });
        // Down arrow
        if (i < steps.length - 1) {
          s.addText("\u2193", {
            x: bx + bwInner / 2 - 0.2, y: sy + stepH, w: 0.4, h: stepGap,
            fontSize: 14, fontFace: "Calibri", color: clr,
            align: "center", valign: "middle", margin: 0,
          });
        }
      });
    }

    const dedSteps = [
      "Employer runs payroll via provider",
      "Payroll provider assesses EWA deductions",
      "Owed amount deducted from paycheck",
      "Deductions sent to EWA provider",
      "Employee receives net paycheck",
    ];
    const intSteps = [
      "Employer processes payroll normally",
      "Paycheck routed through provider",
      "EWA provider intercepts payment",
      "Owed amount deducted by EWA",
      "Remaining released to employee",
    ];
    drawFlow(dedSteps, lx, lw, C.primary, C.lightTeal);
    drawFlow(intSteps, rx, rw, C.purple, C.lightPurple);

    // Pros/cons under each flow
    const proY = flowY + 5 * (stepH + stepGap) + 0.05;
    s.addText("\u2713  Direct employer control, lower risk", {
      x: lx + 0.15, y: proY, w: lw - 0.3, h: 0.35,
      fontSize: 11, fontFace: "Calibri", italic: true, color: C.success,
      valign: "middle", margin: 0,
    });
    s.addText("\u2717  Requires active employer participation", {
      x: lx + 0.15, y: proY + 0.35, w: lw - 0.3, h: 0.35,
      fontSize: 11, fontFace: "Calibri", italic: true, color: C.error,
      valign: "middle", margin: 0,
    });
    s.addText("\u2713  Less employer burden each cycle", {
      x: rx + 0.15, y: proY, w: rw - 0.3, h: 0.35,
      fontSize: 11, fontFace: "Calibri", italic: true, color: C.success,
      valign: "middle", margin: 0,
    });
    s.addText("\u2717  Requires tighter PayCon integration", {
      x: rx + 0.15, y: proY + 0.35, w: rw - 0.3, h: 0.35,
      fontSize: 11, fontFace: "Calibri", italic: true, color: C.error,
      valign: "middle", margin: 0,
    });

    // Bottom note
    const noteY9 = proY + 0.8;
    s.addShape(pres.shapes.RECTANGLE, {
      x: ML, y: noteY9, w: CW, h: 0.45, fill: { color: C.lightGray },
    });
    s.addText("Both models require employer partnership. D2C models (Settlement, Collections) are excluded for the EB channel.", {
      x: ML + 0.3, y: noteY9, w: CW - 0.6, h: 0.45,
      fontSize: 11, fontFace: "Calibri", color: C.text,
      valign: "middle", margin: 0,
    });
    addFooter(s, 9);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 10 — Open Items (card grid)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitle(s, "Pricing, qualification criteria, and collections model need finalization");

    const cardW = 3.7, cardH = 4.8, gap = 0.5;
    const totalW = 3 * cardW + 2 * gap;
    const startX = (W - totalW) / 2;
    const cardY = CY;
    const items = [
      { icon: ic.questionW, bg: C.primary, title: "Pricing\nModel",
        bullets: [
          "Instant vs standard transfer fees",
          "Employer vs employee cost sharing",
          "Competitive benchmark vs DailyPay",
          "Norton Employee Card pricing TBD",
        ] },
      { icon: ic.questionW, bg: C.secondary, title: "Qualification\nCriteria",
        bullets: [
          "Employee tenure threshold (3 months?)",
          "Minimum wage requirements",
          "State-by-state legislation matrix",
          "Instacash overlap handling rules",
        ] },
      { icon: ic.questionW, bg: C.purple, title: "Collections\nModel",
        bullets: [
          "Deduction vs Intercept preference",
          "PayCon integration scope per model",
          "Loss modeling and net loss targets",
          "Reconciliation process design",
        ] },
    ];

    items.forEach((item, i) => {
      const ix = startX + i * (cardW + gap);
      s.addShape(pres.shapes.RECTANGLE, {
        x: ix, y: cardY, w: cardW, h: cardH,
        fill: { color: C.bg }, shadow: shadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: ix, y: cardY, w: cardW, h: 0.1,
        fill: { color: item.bg },
      });
      // TBD badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: ix + cardW - 1.0, y: cardY + 0.25, w: 0.75, h: 0.3,
        fill: { color: C.warning },
      });
      s.addText("TBD", {
        x: ix + cardW - 1.0, y: cardY + 0.25, w: 0.75, h: 0.3,
        fontSize: 11, fontFace: "Calibri", bold: true, color: "FFFFFF",
        align: "center", valign: "middle", margin: 0,
      });
      s.addImage({
        data: item.icon,
        x: ix + 0.35, y: cardY + 0.3, w: 0.5, h: 0.5,
      });
      s.addText(item.title, {
        x: ix + 0.2, y: cardY + 1.0, w: cardW - 0.4, h: 0.7,
        fontSize: 18, fontFace: "Calibri", bold: true, color: C.text,
        valign: "top", margin: 0,
      });
      s.addText(
        item.bullets.map((b, j) => ({
          text: b,
          options: { bullet: true, breakLine: j < item.bullets.length - 1, color: C.text },
        })),
        {
          x: ix + 0.2, y: cardY + 1.85, w: cardW - 0.4, h: 2.5,
          fontSize: 13, fontFace: "Calibri", color: C.text,
          valign: "top", lineSpacingMultiple: 1.5, margin: 0,
        }
      );
    });

    // Bottom callout
    const noteY = cardY + cardH + 0.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x: ML, y: noteY, w: CW, h: 0.5, fill: { color: "FFF7ED" },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: ML, y: noteY, w: 0.08, h: 0.5, fill: { color: C.warning },
    });
    s.addText("These decisions are prerequisites before engineering begins the Phase 1 build.", {
      x: ML + 0.3, y: noteY, w: CW - 0.5, h: 0.5,
      fontSize: 12, fontFace: "Calibri", bold: true, color: C.text,
      valign: "middle", margin: 0,
    });
    addFooter(s, 10);
  }

  await pres.writeFile({ fileName: "output.pptx" });
  console.log("Done \u2014 output.pptx created (" + TOTAL + " slides)");
}

main().catch((err) => { console.error(err); process.exit(1); });

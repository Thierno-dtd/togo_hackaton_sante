import { useState } from "react";
import {
  Pill, Clock, CheckCircle, XCircle, SkipForward, Bell,
  CalendarDays, BarChart2, History, ChevronRight, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */
type StatutPrise = "pris" | "reporté" | "ignoré" | "en_attente";
type StatutTraitement = "en_cours" | "terminé" | "arrêté";

interface Prise {
  id: string;
  date: string;
  heure: string;
  statut: StatutPrise;
}

interface Traitement {
  id: string;
  medicament: string;
  dosage: string;
  forme: string;
  frequence: number;
  duree: string;
  dateDebut: string;
  dateFin: string;
  horaires: string[];
  statut: StatutTraitement;
  instructions?: string;
  prescripteur?: string;
  prises: Prise[];
}

/* ─── Local mock data ─── */
const TRAITEMENTS_INIT: Traitement[] = [
  {
    id: "tr_001",
    medicament: "Amoxicilline",
    dosage: "500mg",
    forme: "Gélule",
    frequence: 3,
    duree: "7 jours",
    dateDebut: "10/03/2026",
    dateFin: "17/03/2026",
    horaires: ["08:00", "13:00", "20:00"],
    statut: "en_cours",
    instructions: "1 gélule au milieu du repas. Terminer le traitement complet.",
    prescripteur: "Dr. Jean Dupont",
    prises: [
      { id: "p1", date: "12/03/2026", heure: "08:00", statut: "pris" },
      { id: "p2", date: "11/03/2026", heure: "08:00", statut: "pris" },
      { id: "p3", date: "11/03/2026", heure: "13:00", statut: "pris" },
      { id: "p4", date: "11/03/2026", heure: "20:00", statut: "reporté" },
      { id: "p5", date: "10/03/2026", heure: "08:00", statut: "pris" },
      { id: "p6", date: "10/03/2026", heure: "13:00", statut: "pris" },
      { id: "p7", date: "10/03/2026", heure: "20:00", statut: "ignoré" },
    ],
  },
  {
    id: "tr_002",
    medicament: "Amlodipine",
    dosage: "5mg",
    forme: "Comprimé",
    frequence: 1,
    duree: "6 mois",
    dateDebut: "15/01/2026",
    dateFin: "15/07/2026",
    horaires: ["08:00"],
    statut: "en_cours",
    instructions: "1 comprimé le matin. Ne pas interrompre sans avis médical.",
    prescripteur: "Dr. Sophie Laurent",
    prises: [
      { id: "p8",  date: "12/03/2026", heure: "08:00", statut: "pris" },
      { id: "p9",  date: "11/03/2026", heure: "08:00", statut: "pris" },
      { id: "p10", date: "10/03/2026", heure: "08:00", statut: "pris" },
    ],
  },
  {
    id: "tr_003",
    medicament: "Paracétamol",
    dosage: "1g",
    forme: "Comprimé",
    frequence: 2,
    duree: "5 jours",
    dateDebut: "01/02/2026",
    dateFin: "06/02/2026",
    horaires: ["08:00", "20:00"],
    statut: "terminé",
    prescripteur: "Dr. Martin Dupont",
    prises: [
      { id: "p11", date: "01/02/2026", heure: "08:00", statut: "pris" },
      { id: "p12", date: "01/02/2026", heure: "20:00", statut: "pris" },
    ],
  },
];

/* ─── Helpers ─── */
const TODAY = "12/03/2026";
const TODAY_LABEL = "Mercredi 12 Mars 2026";

const MOMENT_LABELS: Record<string, string> = {
  "08:00": "MATIN",
  "13:00": "MIDI",
  "20:00": "SOIR",
};

const getMomentLabel = (heure: string) => MOMENT_LABELS[heure] || heure;

const getProgression = (t: Traitement) => {
  const pris = t.prises.filter((p) => p.statut === "pris").length;
  const total = t.frequence * 7;
  return Math.min(100, Math.round((pris / total) * 100));
};

/* ─── Shared styles ─── */
const cardBase: React.CSSProperties = {
  backgroundColor: "white", borderRadius: "1rem",
  border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.5625rem 0.875rem",
  border: "1px solid #e2e8f0", borderRadius: "0.625rem",
  fontSize: "0.875rem", background: "#f8fafc", color: "#374151",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {label}
    </label>
    {children}
  </div>
);

/* ─── Prise card — matches the screenshot design ─── */
const PriseCard = ({
  heure, statut, medicament, dosage, instructions,
  onPris, onReporter, onIgnorer,
}: {
  heure: string; statut: StatutPrise;
  medicament: string; dosage: string; instructions?: string;
  onPris: () => void; onReporter: () => void; onIgnorer: () => void;
}) => {
  const moment = getMomentLabel(heure);
  const isNow = statut === "en_attente";

  /* Border + accent color by statut */
  const borderColor =
    statut === "pris"    ? "#10b981" :
    statut === "reporté" ? "#f59e0b" :
    statut === "ignoré"  ? "#ef4444" :
    "#e2e8f0";

  const accentTop =
    statut === "pris"    ? "#10b981" :
    statut === "reporté" ? "#f59e0b" :
    statut === "ignoré"  ? "#ef4444" :
    "#163344";

  return (
    <div style={{
      flex: "1 1 200px",
      borderRadius: "0.875rem",
      border: `1.5px solid ${borderColor}`,
      background: "white",
      overflow: "hidden",
      boxShadow: statut === "en_attente" ? "0 4px 20px rgba(22,51,68,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
      transition: "all 0.15s",
    }}>
      {/* Top accent bar */}
      <div style={{ height: 3, background: accentTop }} />

      <div style={{ padding: "1rem" }}>
        {/* Moment + heure + badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em" }}>
            {moment} · {heure}
          </span>
          {statut === "pris" && (
            <span style={{ padding: "2px 8px", borderRadius: "9999px", fontSize: "0.625rem", fontWeight: 700, background: "#ecfdf5", color: "#059669", border: "1px solid #6ee7b7" }}>
              PRIS
            </span>
          )}
          {statut === "reporté" && (
            <span style={{ padding: "2px 8px", borderRadius: "9999px", fontSize: "0.625rem", fontWeight: 700, background: "#fffbeb", color: "#d97706", border: "1px solid #fcd34d" }}>
              REPORTÉ
            </span>
          )}
          {statut === "ignoré" && (
            <span style={{ padding: "2px 8px", borderRadius: "9999px", fontSize: "0.625rem", fontWeight: 700, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
              IGNORÉ
            </span>
          )}
          {statut === "en_attente" && (
            <span style={{ padding: "2px 8px", borderRadius: "9999px", fontSize: "0.625rem", fontWeight: 700, background: "#163344", color: "white" }}>
              MAINTENANT
            </span>
          )}
        </div>

        {/* Medicament name */}
        <div style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#1f2937", marginBottom: 4 }}>
          {medicament} {dosage}
        </div>

        {/* Instructions or status note */}
        <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.875rem", minHeight: 18 }}>
          {statut === "pris"
            ? `Pris à ${heure}`
            : statut === "reporté"
            ? "Prise reportée"
            : statut === "ignoré"
            ? "Prise ignorée"
            : instructions || "À prendre maintenant"}
        </div>

        {/* Status / Actions */}
        {statut === "pris" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontSize: "0.8125rem", fontWeight: 600 }}>
            <CheckCircle size={15} /> Validé
          </div>
        )}
        {statut === "reporté" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#f59e0b", fontSize: "0.8125rem", fontWeight: 600 }}>
            <SkipForward size={15} /> Reporté
          </div>
        )}
        {statut === "ignoré" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#ef4444", fontSize: "0.8125rem", fontWeight: 600 }}>
            <XCircle size={15} /> Ignoré
          </div>
        )}
        {statut === "en_attente" && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={onPris} style={{
              flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: "none",
              background: "#163344", color: "white", fontSize: "0.8125rem", fontWeight: 700,
              cursor: "pointer",
            }}>
              Prendre
            </button>
            <button onClick={onReporter} style={{
              flex: 1, padding: "0.5rem", borderRadius: "0.5rem",
              border: "1px solid #e2e8f0", background: "white",
              color: "#374151", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
            }}>
              Reporter
            </button>
            <button onClick={onIgnorer} title="Ignorer" style={{
              width: 36, padding: "0.5rem", borderRadius: "0.5rem",
              border: "1px solid #fecaca", background: "white",
              color: "#ef4444", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <XCircle size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const PatientTreatments = () => {
  const [traitements, setTraitements] = useState<Traitement[]>(TRAITEMENTS_INIT);
  const [activeTab, setActiveTab]     = useState<"en-cours" | "termines">("en-cours");
  const [selectedT, setSelectedT]     = useState<Traitement | null>(null);
  const [showHistModal, setShowHistModal] = useState(false);

  const enCours  = traitements.filter((t) => t.statut === "en_cours");
  const termines = traitements.filter((t) => t.statut !== "en_cours");

  /* ── Prise actions ── */
  const updatePrise = (traitementId: string, heure: string, newStatut: StatutPrise) => {
    setTraitements((prev) => prev.map((t) => {
      if (t.id !== traitementId) return t;
      const existing = t.prises.find((p) => p.date === TODAY && p.heure === heure);
      if (existing) {
        return { ...t, prises: t.prises.map((p) => p.id === existing.id ? { ...p, statut: newStatut } : p) };
      }
      return { ...t, prises: [...t.prises, { id: `${traitementId}_${heure}_${Date.now()}`, date: TODAY, heure, statut: newStatut }] };
    }));
  };

  const getStatutPrise = (t: Traitement, heure: string): StatutPrise => {
    const p = t.prises.find((p) => p.date === TODAY && p.heure === heure);
    return p?.statut || "en_attente";
  };

  const STATUT_CFG: Record<StatutTraitement, { label: string; color: string; bg: string; border: string }> = {
    en_cours: { label: "En cours", color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7" },
    terminé:  { label: "Terminé",  color: "#64748b", bg: "#f1f5f9", border: "#cbd5e1" },
    arrêté:   { label: "Arrêté",   color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  };

  const PRISE_CFG: Record<StatutPrise, { label: string; color: string; icon: React.ReactNode }> = {
    pris:       { label: "Pris",       color: "#10b981", icon: <CheckCircle size={14} /> },
    reporté:    { label: "Reporté",    color: "#f59e0b", icon: <SkipForward size={14} /> },
    ignoré:     { label: "Ignoré",     color: "#ef4444", icon: <XCircle size={14} /> },
    en_attente: { label: "En attente", color: "#94a3b8", icon: <Clock size={14} /> },
  };

  /* ════ RENDER ════ */
  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* ─── Header ─── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1f2937", lineHeight: 1.1 }}>Mes traitements</div>
          <div style={{ fontSize: "0.875rem", color: "#64748b", marginTop: 4 }}>
            Gérez vos rappels et suivez votre observance au quotidien.
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <button onClick={() => setShowHistModal(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0.625rem 1.125rem", borderRadius: "0.75rem",
            border: "1.5px solid #e2e8f0", background: "white",
            color: "#374151", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
          }}>
            <History size={15} /> Historique
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0.625rem 1.125rem", borderRadius: "0.75rem",
            border: "none", background: "#163344",
            color: "white", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
          }}>
            <Bell size={15} /> + Ajouter un rappel
          </button>
        </div>
      </div>

      {/* ─── Rappels du jour ─── */}
      <div style={{ ...cardBase, padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "0.625rem", flexShrink: 0,
            background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CalendarDays size={18} color="#163344" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1f2937" }}>Rappels du jour</div>
            <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>{TODAY_LABEL}</div>
          </div>
        </div>

        {/* One row of prise cards per active traitement */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {enCours.map((t) => (
            <div key={t.id}>
              {/* Traitement label */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                <Pill size={14} color="#163344" />
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#374151" }}>
                  {t.medicament} {t.dosage}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>· {t.forme}</span>
              </div>

              {/* Cards row */}
              <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                {t.horaires.map((heure) => {
                  const statut = getStatutPrise(t, heure);
                  return (
                    <PriseCard
                      key={heure}
                      heure={heure}
                      statut={statut}
                      medicament={t.medicament}
                      dosage={t.dosage}
                      instructions={t.instructions}
                      onPris={() => updatePrise(t.id, heure, "pris")}
                      onReporter={() => updatePrise(t.id, heure, "reporté")}
                      onIgnorer={() => updatePrise(t.id, heure, "ignoré")}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {enCours.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
              <Pill size={36} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
              <div style={{ fontSize: "0.875rem" }}>Aucun traitement en cours</div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div style={cardBase}>
        {/* Tab nav */}
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", padding: "0 1.5rem", gap: "0.25rem" }}>
          {([
            { key: "en-cours", label: `En cours (${enCours.length})` },
            { key: "termines", label: `Terminés (${termines.length})` },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 600,
              background: "none", border: "none", cursor: "pointer",
              color: activeTab === t.key ? "#163344" : "#94a3b8",
              borderBottom: `2px solid ${activeTab === t.key ? "#163344" : "transparent"}`,
              marginBottom: -1, transition: "all 0.15s",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <AnimatePresence mode="wait">

            {/* ══ EN COURS ══ */}
            {activeTab === "en-cours" && (
              <motion.div key="en-cours"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {enCours.map((t, i) => {
                  const prog = getProgression(t);
                  const cfg  = STATUT_CFG[t.statut];
                  return (
                    <motion.div key={t.id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedT(t)}
                      style={{
                        ...cardBase, padding: "1.25rem", cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#163344"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                        <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
                          <div style={{
                            width: 46, height: 46, borderRadius: "0.75rem", flexShrink: 0,
                            background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Pill size={22} color="#10b981" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1f2937", marginBottom: 3 }}>
                              {t.medicament} — {t.dosage}
                            </div>
                            <div style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: 3 }}>
                              {t.forme} · {t.frequence}x/jour · {t.duree}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#94a3b8", marginBottom: 8 }}>
                              <Clock size={11} /> Horaires : {t.horaires.join(", ")}
                            </div>
                            <div style={{ fontSize: "0.6875rem", color: "#94a3b8", marginBottom: 6 }}>
                              Du {t.dateDebut} au {t.dateFin}
                            </div>
                            {/* Progress bar */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ flex: 1, maxWidth: 120, height: 6, borderRadius: "9999px", background: "#e2e8f0" }}>
                                <div style={{ height: 6, borderRadius: "9999px", background: "#10b981", width: `${prog}%`, transition: "width 0.3s" }} />
                              </div>
                              <span style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 600 }}>{prog}%</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                          <span style={{
                            padding: "3px 10px", borderRadius: "9999px",
                            fontSize: "0.6875rem", fontWeight: 700,
                            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                          }}>
                            {cfg.label}
                          </span>
                          <ChevronRight size={16} color="#94a3b8" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* ══ TERMINÉS ══ */}
            {activeTab === "termines" && (
              <motion.div key="termines"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {termines.map((t, i) => {
                  const cfg = STATUT_CFG[t.statut];
                  return (
                    <motion.div key={t.id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ ...cardBase, padding: "1.25rem", opacity: 0.75 }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                        <div style={{
                          width: 46, height: 46, borderRadius: "0.75rem", flexShrink: 0,
                          background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Pill size={22} color="#94a3b8" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#374151", marginBottom: 3 }}>
                            {t.medicament} — {t.dosage}
                          </div>
                          <div style={{ fontSize: "0.8125rem", color: "#94a3b8", marginBottom: 3 }}>
                            {t.forme} · {t.frequence}x/jour · {t.duree}
                          </div>
                          <div style={{ fontSize: "0.6875rem", color: "#94a3b8", marginBottom: 8 }}>
                            Du {t.dateDebut} au {t.dateFin}
                          </div>
                          <span style={{
                            padding: "3px 10px", borderRadius: "9999px",
                            fontSize: "0.6875rem", fontWeight: 700,
                            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                          }}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {termines.length === 0 && (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                    <BarChart2 size={36} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                    <div style={{ fontSize: "0.875rem" }}>Aucun traitement terminé</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Detail Modal ─── */}
      {selectedT && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }} onClick={() => setSelectedT(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", borderRadius: "1rem", width: "100%", maxWidth: 500,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto",
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              position: "sticky", top: 0, background: "white", zIndex: 1,
            }}>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1f2937" }}>Détails du traitement</div>
              <button onClick={() => setSelectedT(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{ width: 52, height: 52, borderRadius: "0.875rem", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Pill size={26} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1f2937" }}>{selectedT.medicament}</div>
                  <span style={{
                    padding: "2px 10px", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: 700,
                    background: STATUT_CFG[selectedT.statut].bg, color: STATUT_CFG[selectedT.statut].color,
                    border: `1px solid ${STATUT_CFG[selectedT.statut].border}`,
                  }}>
                    {STATUT_CFG[selectedT.statut].label}
                  </span>
                </div>
              </div>

              {/* Info grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                {[
                  { label: "Dosage",    value: selectedT.dosage },
                  { label: "Forme",     value: selectedT.forme },
                  { label: "Fréquence", value: `${selectedT.frequence}x par jour` },
                  { label: "Durée",     value: selectedT.duree },
                  { label: "Début",     value: selectedT.dateDebut },
                  { label: "Fin",       value: selectedT.dateFin },
                  ...(selectedT.prescripteur ? [{ label: "Prescripteur", value: selectedT.prescripteur }] : []),
                ].map((f) => (
                  <div key={f.label}>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Horaires */}
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>Horaires de prise</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {selectedT.horaires.map((h) => (
                    <span key={h} style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 12px", borderRadius: "9999px",
                      background: "#f1f5f9", color: "#374151", fontSize: "0.8125rem", fontWeight: 600,
                    }}>
                      <Clock size={12} /> {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {selectedT.instructions && (
                <div style={{ padding: "0.875rem", borderRadius: "0.625rem", background: "#fffbeb", border: "1px solid #fcd34d", fontSize: "0.875rem", color: "#92400e" }}>
                  ⚠️ {selectedT.instructions}
                </div>
              )}

              {/* Historique récent */}
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>Historique récent</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 180, overflowY: "auto" }}>
                  {selectedT.prises.slice(0, 10).map((p) => {
                    const cfg = PRISE_CFG[p.statut];
                    return (
                      <div key={p.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "6px 10px", borderRadius: "0.5rem", fontSize: "0.8125rem",
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ color: "#64748b" }}>{p.date} à {p.heure}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: cfg.color, fontWeight: 600 }}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.625rem" }}>
                <button style={{
                  flex: 1, padding: "0.625rem", borderRadius: "0.625rem",
                  border: "1px solid #fecaca", background: "white",
                  color: "#ef4444", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                }}>
                  Arrêter le traitement
                </button>
                <button style={{
                  flex: 1, padding: "0.625rem", borderRadius: "0.625rem",
                  border: "1px solid #e2e8f0", background: "white",
                  color: "#374151", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <Bell size={14} /> Modifier rappels
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PatientTreatments;
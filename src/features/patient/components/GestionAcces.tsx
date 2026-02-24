import React, { useState } from 'react';
import { useAuthStore } from '@core/auth/auth.store';
import {
  useAutorisations,
  useHistoriqueAcces,
  useDemandesAcces,
  useRepondreDemande,
  useRevoquerAutorisation,
  useAjouterAutorisation,
} from '../hooks/useGestionAcces';

/* ─── Helpers ─── */

const getAccessLabel = (type: string) => {
  switch (type) {
    case 'complet':
      return 'Accès complet';
    case 'temporaire':
      return 'Consultation seulement';
    case 'lecture':
      return 'Accès limité';
    default:
      return type;
  }
};

const formatHistoriqueDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  if (diffDays === 0) return `Aujourd'hui, ${time}`;
  if (diffDays === 1) return `Hier, ${time}`;
  return `${date.toLocaleDateString('fr-FR')}, ${time}`;
};

/* ─── Component ─── */

const GestionAcces: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const patientId = user?.id ?? '';

  const [searchTerm, setSearchTerm] = useState('');
  const [niveauAcces, setNiveauAcces] = useState<'lecture' | 'complet'>('lecture');

  const { data: autorisations, isLoading: loadingAuth } = useAutorisations(user?.id);
  const { data: demandes, isLoading: loadingDem } = useDemandesAcces(user?.id);
  const { data: historique, isLoading: loadingHist } = useHistoriqueAcces(user?.id);
  const repondre = useRepondreDemande(patientId);
  const revoquer = useRevoquerAutorisation(patientId);
  const ajouterAuth = useAjouterAutorisation(patientId);

  const isLoading = loadingAuth || loadingDem || loadingHist;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 48, height: 48, border: '4px solid #10b981', borderTopColor: 'transparent',
              borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ marginTop: 16, color: '#94a3b8' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ─── Hero Banner ─── */}
      <div
        style={{
          background: 'linear-gradient(to right, #163344, #1e293b)',
          borderRadius: '1rem',
          padding: '2rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '42rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Sécurité et Confidentialité
          </div>
          <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
            Contrôlez qui peut accéder à vos données de santé. Vous pouvez autoriser de nouveaux
            praticiens ou révoquer des accès à tout moment pour garantir la protection de votre vie privée.
          </p>
        </div>
        <div
          style={{
            position: 'absolute', right: 0, top: 0, height: '100%', width: '33%',
            opacity: 0.1, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          }}
        >
          <i className="fas fa-shield-alt" style={{ fontSize: '180px', marginRight: -10, transform: 'rotate(12deg)' }} />
        </div>
      </div>

      {/* ─── Demandes en attente ─── */}
      {demandes && demandes.length > 0 && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '1rem',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            <i className="fas fa-user-clock" style={{ color: '#f59e0b' }} />
            <span>Demandes d'accès en attente</span>
            <span
              style={{
                fontSize: '0.75rem', fontWeight: 500,
                padding: '0.125rem 0.5rem',
                backgroundColor: '#fef3c7', color: '#b45309',
                borderRadius: '9999px',
              }}
            >
              {demandes.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {demandes.map((demande) => (
              <div
                key={demande.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  border: '1px solid #fef3c7',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: '0.75rem',
                      backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#d97706', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
                    }}
                  >
                    {demande.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 0 }}>{demande.medecinNom}</div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '2px 0' }}>{demande.specialite}</p>
                    <p style={{ fontSize: '0.875rem', margin: '4px 0' }}>
                      <span style={{ fontWeight: 500 }}>Motif :</span> {demande.motif}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: '#94a3b8' }}>
                        <i className="fas fa-clock" style={{ fontSize: 12 }} />
                        {new Date(demande.dateDemande).toLocaleDateString('fr-FR')}
                      </span>
                      <span
                        style={{
                          padding: '0.125rem 0.5rem',
                          backgroundColor: '#fef3c7', color: '#b45309',
                          borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase',
                        }}
                      >
                        Accès {demande.typeAcces}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#10b981', color: 'white', border: 'none',
                      borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                    }}
                    onClick={() => repondre.mutate({ demandeId: demande.id, acceptee: true })}
                    disabled={repondre.isPending}
                  >
                    <i className="fas fa-check" style={{ fontSize: 12 }} />
                    Accepter
                  </button>
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent', color: '#ef4444',
                      border: '1px solid #fecaca',
                      borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                    }}
                    onClick={() => repondre.mutate({ demandeId: demande.id, acceptee: false })}
                    disabled={repondre.isPending}
                  >
                    <i className="fas fa-times" style={{ fontSize: 12 }} />
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Main Grid ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '2rem',
        }}
        className="gestion-acces-grid"
      >
        {/* ── Colonne gauche (2/3) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="gestion-acces-left">
          {/* Médecins autorisés */}
          <section
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
                <i className="fas fa-user-shield" style={{ color: '#10b981' }} />
                <span>Médecins autorisés</span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem', fontWeight: 500,
                  padding: '0.25rem 0.625rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669',
                  borderRadius: '9999px',
                }}
              >
                {autorisations?.length ?? 0} Praticien{(autorisations?.length ?? 0) > 1 ? 's' : ''} actif{(autorisations?.length ?? 0) > 1 ? 's' : ''}
              </span>
            </div>
            <div>
              {autorisations?.map((auth, idx) => (
                <div
                  key={auth.id}
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: 48, height: 48, borderRadius: '0.75rem',
                        backgroundColor: '#f1f5f9', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        outline: '2px solid #e2e8f0', outlineOffset: '1px',
                        color: '#475569', fontWeight: 600, fontSize: '0.875rem',
                        flexShrink: 0,
                      }}
                    >
                      {auth.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 0 }}>{auth.medecinNom}</div>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '2px 0' }}>{auth.specialite}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.375rem', gap: '0.75rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: '#94a3b8' }}>
                          <i className="fas fa-history" style={{ fontSize: 11 }} />
                          Autorisé le {new Date(auth.dateDebut).toLocaleDateString('fr-FR')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: '#94a3b8' }}>
                          <i className="fas fa-check-circle" style={{ fontSize: 11, color: '#10b981' }} />
                          {getAccessLabel(auth.typeAcces)}
                        </span>
                        {auth.dateFin && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: '#f97316' }}>
                            <i className="fas fa-calendar-times" style={{ fontSize: 11 }} />
                            Expire le {new Date(auth.dateFin).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent', color: '#ef4444',
                      border: '1px solid #fee2e2',
                      borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500,
                      cursor: 'pointer', flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                    onClick={() => revoquer.mutate(auth.id)}
                    disabled={revoquer.isPending}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#ef4444';
                      e.currentTarget.style.borderColor = '#fee2e2';
                    }}
                  >
                    <i className="fas fa-ban" style={{ fontSize: 12 }} />
                    <span>Révoquer</span>
                  </button>
                </div>
              ))}
              {(!autorisations || autorisations.length === 0) && (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  <i className="fas fa-shield-alt" style={{ fontSize: '3rem', marginBottom: '0.75rem', opacity: 0.3, display: 'block' }} />
                  <p style={{ margin: 0 }}>Aucun praticien autorisé</p>
                </div>
              )}
            </div>
          </section>

          {/* Historique des accès */}
          <section
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
                <i className="fas fa-history" style={{ color: '#163344' }} />
                <span>Historique des accès</span>
              </div>
              <button
                style={{
                  fontSize: '0.75rem', color: '#10b981', fontWeight: 500,
                  backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                }}
              >
                <i className="fas fa-download" style={{ fontSize: 10 }} />
                Télécharger le rapport
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '1rem 1.5rem' }}>Praticien</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Action</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Date &amp; Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {historique?.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      style={{ borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none' }}
                    >
                      <td style={{
                        padding: '1rem 1.5rem', fontWeight: 500,
                        color: entry.action === 'export' ? '#ef4444' : undefined,
                      }}>
                        {entry.medecinNom}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{entry.details}</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#64748b' }}>
                        {formatHistoriqueDate(entry.date)}
                      </td>
                    </tr>
                  ))}
                  {(!historique || historique.length === 0) && (
                    <tr>
                      <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        Aucun historique d'accès
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ── Colonne droite (1/3) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="gestion-acces-right">
          {/* Autoriser un praticien */}
          <section
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
            }}
          >
            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <i className="fas fa-user-plus" style={{ color: '#10b981' }} />
              <span>Autoriser un praticien</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Recherchez un médecin par son nom ou son identifiant professionnel (RPPS) pour lui donner accès.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.375rem', marginLeft: '0.25rem' }}>
                  Nom ou Identifiant RPPS
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ex: Dr. Martin ou 1000..."
                    style={{
                      width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem',
                      paddingTop: '0.625rem', paddingBottom: '0.625rem',
                      backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                      borderRadius: '0.75rem', fontSize: '0.875rem',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  borderRadius: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                  Niveau d'accès
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label
                    style={{
                      display: 'flex', alignItems: 'center', padding: '0.5rem',
                      borderRadius: '0.5rem', cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="access_type_gestion"
                      checked={niveauAcces === 'lecture'}
                      onChange={() => setNiveauAcces('lecture')}
                      style={{ accentColor: '#10b981' }}
                    />
                    <span style={{ marginLeft: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>Lecture seule</span>
                  </label>
                  <label
                    style={{
                      display: 'flex', alignItems: 'center', padding: '0.5rem',
                      borderRadius: '0.5rem', cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="access_type_gestion"
                      checked={niveauAcces === 'complet'}
                      onChange={() => setNiveauAcces('complet')}
                      style={{ accentColor: '#10b981' }}
                    />
                    <span style={{ marginLeft: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>Modification autorisée</span>
                  </label>
                </div>
              </div>
              <button
                style={{
                  width: '100%', padding: '0.75rem',
                  backgroundColor: !searchTerm.trim() ? '#94a3b8' : '#10b981',
                  color: 'white', border: 'none',
                  borderRadius: '0.75rem', fontWeight: 700,
                  cursor: !searchTerm.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: !searchTerm.trim() ? 'none' : '0 10px 15px -3px rgba(16, 185, 129, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontSize: '0.875rem',
                  opacity: !searchTerm.trim() ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
                disabled={!searchTerm.trim() || ajouterAuth.isPending}
                onClick={() => {
                  if (searchTerm.trim()) {
                    ajouterAuth.mutate({ medecinId: searchTerm.trim(), typeAcces: niveauAcces });
                    setSearchTerm('');
                  }
                }}
              >
                <i className="fas fa-key" />
                <span>Générer l'autorisation</span>
              </button>
            </div>
          </section>

          {/* Votre sécurité */}
          <section
            style={{
              backgroundColor: '#163344',
              color: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <i className="fas fa-lock" style={{ color: '#10b981' }} />
                <span>Votre sécurité</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                Toutes les données sont cryptées de bout en bout. LAMESSE DAMA respecte les normes
                RGPD et HDS (Hébergeur de Données de Santé) les plus strictes.
              </p>
              <a
                href="#"
                style={{
                  display: 'inline-block', marginTop: '1rem',
                  fontSize: '0.75rem', fontWeight: 700,
                  color: '#34d399', textDecoration: 'none',
                }}
              >
                En savoir plus sur la protection des données →
              </a>
            </div>
            <div style={{ position: 'absolute', bottom: -16, right: -16, opacity: 0.05, pointerEvents: 'none' }}>
              <i className="fas fa-certificate" style={{ fontSize: 120 }} />
            </div>
          </section>

          {/* Besoin d'aide */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#163344',
                }}
              >
                <i className="fas fa-question-circle" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 0 }}>Besoin d'aide ?</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Une question sur vos accès ?</p>
              </div>
            </div>
            <button
              style={{
                width: '100%', marginTop: '1rem', padding: '0.5rem',
                fontSize: '0.875rem', fontWeight: 500,
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem', cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Contacter le support
            </button>
          </div>
        </div>
      </div>

      {/* ─── Responsive grid CSS (injected via style tag) ─── */}
      <style>{`
        @media (min-width: 1024px) {
          .gestion-acces-grid {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GestionAcces;

import React, { useState } from 'react';
import { useAuthStore } from '@core/auth/auth.store';
import { useOrdonnancesPatient, useGenererQRCode } from '../hooks/useOrdonnancePatient';
import type { OrdonnancePatient, OrdonnanceQRStatus } from '../types/patient.types';
import type { PrescriptionStatus } from '@shared/types';

type OrdonnanceFilter = 'toutes' | 'active' | 'utilisee' | 'expiree';

const STATUS_CONFIG: Record<PrescriptionStatus, { label: string; badge: string }> = {
  active: { label: 'Active', badge: 'badge-success' },
  utilisee: { label: 'Utilisée', badge: 'badge-info' },
  expiree: { label: 'Expirée', badge: 'badge-secondary' },
  annulee: { label: 'Annulée', badge: 'badge-danger' },
};

const QR_STATUS_CONFIG: Record<OrdonnanceQRStatus, { label: string; icon: string; color: string }> = {
  valide: { label: 'QR Valide', icon: 'fas fa-qrcode', color: 'text-green-600' },
  utilisee: { label: 'QR Utilisé', icon: 'fas fa-check-circle', color: 'text-blue-600' },
  expiree: { label: 'QR Expiré', icon: 'fas fa-times-circle', color: 'text-gray-400' },
};

const OrdonnancesPatient: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { data: ordonnances, isLoading } = useOrdonnancesPatient(user?.id);
  const genererQR = useGenererQRCode();
  const [filter, setFilter] = useState<OrdonnanceFilter>('toutes');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    ordonnances?.filter((o) => filter === 'toutes' || o.status === filter) ?? [];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="content-body text-center py-12">
          <i className="fas fa-spinner fa-spin text-3xl text-primary"></i>
          <p className="mt-4">Chargement de vos ordonnances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="content-header-app">
        <div
          className="header-image"
          style={{
            background:
              'linear-gradient(rgba(245, 158, 11, 0.8), rgba(245, 158, 11, 0.9)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
          }}
        >
          <div className="header-overlay">
            <h1>Mes Ordonnances</h1>
            <p>Consultez vos prescriptions et générez vos QR codes</p>
          </div>
        </div>
      </div>

      <div className="content-body">
        {/* Stats rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="content-card-app text-center">
            <p className="text-3xl font-bold text-green-600">
              {ordonnances?.filter((o) => o.status === 'active').length ?? 0}
            </p>
            <p className="text-sm text-gray-500">Actives</p>
          </div>
          <div className="content-card-app text-center">
            <p className="text-3xl font-bold text-blue-600">
              {ordonnances?.filter((o) => o.status === 'utilisee').length ?? 0}
            </p>
            <p className="text-sm text-gray-500">Utilisées</p>
          </div>
          <div className="content-card-app text-center">
            <p className="text-3xl font-bold text-gray-400">
              {ordonnances?.filter((o) => o.status === 'expiree').length ?? 0}
            </p>
            <p className="text-sm text-gray-500">Expirées</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="tabs mb-6">
          {(
            [
              { key: 'toutes', label: 'Toutes' },
              { key: 'active', label: 'Actives' },
              { key: 'utilisee', label: 'Utilisées' },
              { key: 'expiree', label: 'Expirées' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              className={`tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Liste des ordonnances */}
        <div className="space-y-4">
          {filtered.map((ord) => (
            <OrdonnanceCard
              key={ord.id}
              ordonnance={ord}
              expanded={expandedId === ord.id}
              onToggle={() => toggleExpand(ord.id)}
              onGenererQR={() => genererQR.mutate(ord.id)}
              isGeneratingQR={genererQR.isPending}
            />
          ))}
          {filtered.length === 0 && (
            <div className="content-card-app text-center py-8 text-gray-400">
              <i className="fas fa-prescription text-4xl mb-3"></i>
              <p>Aucune ordonnance trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Sous-composant carte ordonnance ────────────────────────

interface OrdonnanceCardProps {
  ordonnance: OrdonnancePatient;
  expanded: boolean;
  onToggle: () => void;
  onGenererQR: () => void;
  isGeneratingQR: boolean;
}

const OrdonnanceCard: React.FC<OrdonnanceCardProps> = ({
  ordonnance: ord,
  expanded,
  onToggle,
  onGenererQR,
  isGeneratingQR,
}) => {
  const statusCfg = STATUS_CONFIG[ord.status];
  const qrCfg = QR_STATUS_CONFIG[ord.qrStatus];

  return (
    <div className="content-card-app">
      {/* Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <i className="fas fa-prescription text-xl"></i>
          </div>
          <div>
            <h4 className="font-semibold">{ord.medecinNom}</h4>
            <p className="text-sm text-gray-500">{ord.specialite}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span>
                <i className="fas fa-calendar"></i>{' '}
                {new Date(ord.dateCreation).toLocaleDateString('fr-FR')}
              </span>
              <span>
                <i className="fas fa-hourglass-end"></i> Expire le{' '}
                {new Date(ord.dateExpiration).toLocaleDateString('fr-FR')}
              </span>
              <span className={qrCfg.color}>
                <i className={qrCfg.icon}></i> {qrCfg.label}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${statusCfg.badge}`}>{statusCfg.label}</span>
          <span className="text-sm text-gray-400">
            {ord.medicaments.length} médicament{ord.medicaments.length > 1 ? 's' : ''}
          </span>
          <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-gray-400`}></i>
        </div>
      </div>

      {/* Détails (expandable) */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {ord.notes && (
            <p className="text-sm text-gray-600 mb-4">
              <i className="fas fa-sticky-note text-amber-500"></i> {ord.notes}
            </p>
          )}

          {/* Médicaments */}
          <div className="space-y-3">
            {ord.medicaments.map((med) => (
              <div
                key={med.id}
                className={`p-3 rounded-lg border ${
                  med.pris ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">
                      {med.nom} - {med.dosage}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {med.frequence} • {med.duree}
                    </p>
                    {med.instructions && (
                      <p className="text-xs text-blue-500 mt-1">
                        <i className="fas fa-info-circle"></i> {med.instructions}
                      </p>
                    )}
                  </div>
                  {med.pris && (
                    <span className="badge badge-success">
                      <i className="fas fa-check"></i> Pris
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          {ord.status === 'active' && (
            <div className="flex gap-3 mt-4">
              {ord.qrStatus === 'valide' && ord.qrCode && (
                <button className="btn btn-outline btn-sm">
                  <i className="fas fa-qrcode"></i> Afficher QR Code
                </button>
              )}
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onGenererQR();
                }}
                disabled={isGeneratingQR}
              >
                <i className={`fas ${isGeneratingQR ? 'fa-spinner fa-spin' : 'fa-sync'}`}></i>{' '}
                Régénérer QR
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdonnancesPatient;

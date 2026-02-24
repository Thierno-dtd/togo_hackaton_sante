import React, { useState, useMemo } from 'react';
import { useHealthCenters } from '../hooks/useHealthCenters';
import type { TypeEtablissement, DisponibiliteStatus, CentreSanteFilter } from '../types/patient.types';

const TYPE_ICONS: Record<TypeEtablissement, string> = {
  'Hôpital': 'fas fa-hospital',
  'Clinique': 'fas fa-clinic-medical',
  'Pharmacie': 'fas fa-pills',
  'Laboratoire': 'fas fa-flask',
  'Cabinet': 'fas fa-user-md',
};

const DISPO_CONFIG: Record<DisponibiliteStatus, { badge: string; icon: string }> = {
  'Disponible': { badge: 'badge-success', icon: 'fas fa-check-circle' },
  'Complet': { badge: 'badge-danger', icon: 'fas fa-times-circle' },
  'Partiellement disponible': { badge: 'badge-warning', icon: 'fas fa-exclamation-circle' },
};

const DisponibilitesPatient: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeEtablissement | ''>('');
  const [dispoFilter, setDispoFilter] = useState<DisponibiliteStatus | ''>('');

  const filters: CentreSanteFilter = useMemo(() => ({
    search: search || undefined,
    type: typeFilter || undefined,
    disponibilite: dispoFilter || undefined,
  }), [search, typeFilter, dispoFilter]);

  const { data: centres, isLoading } = useHealthCenters(filters);

  const types: TypeEtablissement[] = ['Hôpital', 'Clinique', 'Pharmacie', 'Laboratoire', 'Cabinet'];

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="content-body text-center py-12">
          <i className="fas fa-spinner fa-spin text-3xl text-primary"></i>
          <p className="mt-4">Recherche des centres de santé...</p>
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
              'linear-gradient(rgba(6, 182, 212, 0.8), rgba(6, 182, 212, 0.9)), url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
          }}
        >
          <div className="header-overlay">
            <h1>Disponibilités des Centres</h1>
            <p>Trouvez un établissement de santé près de chez vous</p>
          </div>
        </div>
      </div>

      <div className="content-body">
        {/* Filtres */}
        <div className="content-card-app mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Rechercher</label>
              <div className="search-input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom, adresse, service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="form-label">Type d'établissement</label>
              <select
                className="form-control"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeEtablissement | '')}
              >
                <option value="">Tous les types</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Disponibilité</label>
              <select
                className="form-control"
                value={dispoFilter}
                onChange={(e) => setDispoFilter(e.target.value as DisponibiliteStatus | '')}
              >
                <option value="">Toutes</option>
                <option value="Disponible">Disponible</option>
                <option value="Partiellement disponible">Partiellement disponible</option>
                <option value="Complet">Complet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <p className="text-sm text-gray-500 mb-4">
          {centres?.length ?? 0} établissement{(centres?.length ?? 0) > 1 ? 's' : ''} trouvé{(centres?.length ?? 0) > 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {centres?.map((centre) => {
            const dispoCfg = DISPO_CONFIG[centre.disponibilite];
            const typeIcon = TYPE_ICONS[centre.type] ?? 'fas fa-building';

            return (
              <div key={centre.id} className="content-card-app">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                    <i className={`${typeIcon} text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{centre.nom}</h4>
                        <p className="text-sm text-gray-500">{centre.type}</p>
                      </div>
                      <span className={`badge ${dispoCfg.badge}`}>
                        <i className={`${dispoCfg.icon} mr-1`}></i>
                        {centre.disponibilite}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-gray-500">
                      <p>
                        <i className="fas fa-map-marker-alt text-gray-400 w-5"></i>
                        {centre.adresse}
                      </p>
                      <p>
                        <i className="fas fa-phone text-gray-400 w-5"></i>
                        {centre.telephone}
                      </p>
                      <p>
                        <i className="fas fa-clock text-gray-400 w-5"></i>
                        {centre.horaires}
                      </p>
                      {centre.distance && (
                        <p>
                          <i className="fas fa-route text-gray-400 w-5"></i>
                          {centre.distance}
                        </p>
                      )}
                    </div>

                    {/* Services */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {centre.services.slice(0, 4).map((svc, idx) => (
                        <span key={idx} className="badge badge-outline text-xs">
                          {svc}
                        </span>
                      ))}
                      {centre.services.length > 4 && (
                        <span className="badge badge-outline text-xs">
                          +{centre.services.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Note */}
                    {centre.note && (
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`fas fa-star text-xs ${
                              star <= Math.round(centre.note!) ? 'text-amber-400' : 'text-gray-200'
                            }`}
                          ></i>
                        ))}
                        <span className="text-xs text-gray-400 ml-1">{centre.note.toFixed(1)}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <a href={`tel:${centre.telephone}`} className="btn btn-outline btn-sm">
                        <i className="fas fa-phone"></i> Appeler
                      </a>
                      {centre.disponibilite !== 'Complet' && (
                        <button className="btn btn-primary btn-sm">
                          <i className="fas fa-calendar-plus"></i> Prendre RDV
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {centres?.length === 0 && (
          <div className="content-card-app text-center py-8 text-gray-400">
            <i className="fas fa-search text-4xl mb-3"></i>
            <p>Aucun établissement ne correspond à vos critères</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisponibilitesPatient;

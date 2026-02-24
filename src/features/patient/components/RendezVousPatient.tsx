import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@core/auth/auth.store';
import { useRendezVous, useCreerRendezVous, useAnnulerRendezVous } from '../hooks/useRendezVous';
import type { RendezVousStatus, RendezVousType, CreateRendezVousDTO } from '../types/patient.types';

type FilterTab = 'tous' | 'a_venir' | 'passes';

const STATUS_CONFIG: Record<RendezVousStatus, { label: string; badge: string; icon: string }> = {
  planifie: { label: 'Planifié', badge: 'badge-info', icon: 'fas fa-clock' },
  confirme: { label: 'Confirmé', badge: 'badge-success', icon: 'fas fa-check-circle' },
  en_cours: { label: 'En cours', badge: 'badge-primary', icon: 'fas fa-spinner' },
  termine: { label: 'Terminé', badge: 'badge-secondary', icon: 'fas fa-check-double' },
  annule: { label: 'Annulé', badge: 'badge-danger', icon: 'fas fa-times-circle' },
};

const TYPE_LABELS: Record<RendezVousType, string> = {
  consultation: 'Consultation',
  suivi: 'Suivi',
  urgence: 'Urgence',
  teleconsultation: 'Téléconsultation',
  examen: 'Examen',
};

const RendezVousPatient: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const patientId = user?.id ?? '';
  const { data: rendezVous, isLoading } = useRendezVous(user?.id);
  const creer = useCreerRendezVous(patientId);
  const annuler = useAnnulerRendezVous(patientId);

  const [filter, setFilter] = useState<FilterTab>('tous');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateRendezVousDTO>({
    medecinId: '',
    date: '',
    heure: '',
    type: 'consultation',
    motif: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const filtered = useMemo(() => {
    if (!rendezVous) return [];
    switch (filter) {
      case 'a_venir':
        return rendezVous.filter((r) => r.date >= today && r.status !== 'annule' && r.status !== 'termine');
      case 'passes':
        return rendezVous.filter((r) => r.date < today || r.status === 'termine');
      default:
        return rendezVous;
    }
  }, [rendezVous, filter, today]);

  const prochainRdv = rendezVous?.find(
    (r) => r.date >= today && (r.status === 'confirme' || r.status === 'planifie')
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await creer.mutateAsync(formData);
    setShowForm(false);
    setFormData({ medecinId: '', date: '', heure: '', type: 'consultation', motif: '' });
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="content-body text-center py-12">
          <i className="fas fa-spinner fa-spin text-3xl text-primary"></i>
          <p className="mt-4">Chargement de vos rendez-vous...</p>
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
              'linear-gradient(rgba(20, 184, 166, 0.8), rgba(20, 184, 166, 0.9)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
          }}
        >
          <div className="header-overlay">
            <h1>Mes Rendez-vous</h1>
            <p>Gérez vos consultations et suivis médicaux</p>
          </div>
        </div>
      </div>

      <div className="content-body">
        {/* Prochain rendez-vous */}
        {prochainRdv && (
          <div className="content-card-app mb-6 border-l-4 border-teal-500">
            <h3 className="card-title">
              <i className="fas fa-calendar-check text-teal-500"></i> Prochain rendez-vous
            </h3>
            <div className="flex items-center gap-4 mt-3">
              <div className="avatar avatar-lg">
                <span>{prochainRdv.avatar}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{prochainRdv.medecinNom}</h4>
                <p className="text-sm text-gray-500">{prochainRdv.specialite}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span>
                    <i className="fas fa-calendar"></i>{' '}
                    {new Date(prochainRdv.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> {prochainRdv.heure}
                  </span>
                  <span>
                    <i className="fas fa-map-marker-alt"></i> {prochainRdv.lieu}
                  </span>
                </div>
              </div>
              <span className={`badge ${STATUS_CONFIG[prochainRdv.status].badge}`}>
                {STATUS_CONFIG[prochainRdv.status].label}
              </span>
            </div>
          </div>
        )}

        {/* Actions + Filters */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="tabs">
            {(
              [
                { key: 'tous', label: 'Tous' },
                { key: 'a_venir', label: 'À venir' },
                { key: 'passes', label: 'Passés' },
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
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showForm ? ' Fermer' : ' Nouveau rendez-vous'}
          </button>
        </div>

        {/* Formulaire nouveau rendez-vous */}
        {showForm && (
          <div className="content-card-app mb-6">
            <h3 className="card-title">
              <i className="fas fa-calendar-plus"></i> Prendre un rendez-vous
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  min={today}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Heure</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.heure}
                  onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Type</label>
                <select
                  className="form-control"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as RendezVousType })
                  }
                >
                  {Object.entries(TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Motif</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Motif de la consultation..."
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={creer.isPending}>
                  {creer.isPending ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-check"></i>
                  )}{' '}
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des rendez-vous */}
        <div className="space-y-4">
          {filtered.map((rdv) => {
            const config = STATUS_CONFIG[rdv.status];
            const isPast = rdv.status === 'termine' || rdv.status === 'annule';
            return (
              <div
                key={rdv.id}
                className={`content-card-app ${isPast ? 'opacity-70' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="avatar avatar-md">
                      <span>{rdv.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{rdv.medecinNom}</h4>
                      <p className="text-sm text-gray-500">{rdv.specialite}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span>
                          <i className="fas fa-calendar"></i>{' '}
                          {new Date(rdv.date).toLocaleDateString('fr-FR')}
                        </span>
                        <span>
                          <i className="fas fa-clock"></i> {rdv.heure}
                        </span>
                        <span>
                          <i className="fas fa-map-marker-alt"></i> {rdv.lieu}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{rdv.motif}</p>
                      {rdv.notes && (
                        <p className="text-xs text-blue-500 mt-1">
                          <i className="fas fa-sticky-note"></i> {rdv.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge badge-outline text-xs">{TYPE_LABELS[rdv.type]}</span>
                    <span className={`badge ${config.badge}`}>
                      <i className={`${config.icon} mr-1`}></i>
                      {config.label}
                    </span>
                    {!isPast && rdv.status !== 'en_cours' && (
                      <button
                        className="btn btn-outline btn-danger btn-sm"
                        onClick={() => annuler.mutate(rdv.id)}
                        disabled={annuler.isPending}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                    {rdv.type === 'teleconsultation' && !isPast && (
                      <button className="btn btn-primary btn-sm">
                        <i className="fas fa-video"></i> Rejoindre
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="content-card-app text-center py-8 text-gray-400">
              <i className="fas fa-calendar-times text-4xl mb-3"></i>
              <p>Aucun rendez-vous trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RendezVousPatient;

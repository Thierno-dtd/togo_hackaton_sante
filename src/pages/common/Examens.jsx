import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Examens = () => {
    const { user } = useAuth();
    const [examens] = React.useState([
        { id: 1, type: 'Radiographie', date: '2024-03-15', status: 'Effectué' },
        { id: 2, type: 'Prise de sang', date: '2024-03-20', status: 'Planifié' },
    ]);

    return (
        <div className="page-content">
            <div className="content-body" style={{padding: '30px'}}>
                <div className="flex justify-between items-center mb-6">
                    <h2>Examens médicaux</h2>
                    {user.role === 'medecin' && (
                        <button className="btn btn-primary">
                            <i className="fas fa-plus"></i> Nouvel examen
                        </button>
                    )}
                </div>

                <div className="grid gap-4">
                    {examens.map(exam => (
                        <div key={exam.id} className="content-card-app">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4>{exam.type}</h4>
                                    <p className="text-gray-600">{exam.date}</p>
                                </div>
                                <span className="badge badge-success">{exam.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Examens;
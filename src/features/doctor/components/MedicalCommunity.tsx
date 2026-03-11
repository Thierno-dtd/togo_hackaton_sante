import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Paperclip, Smile, AtSign, ShieldAlert,
  Circle, Image as ImageIcon, FileText, X,
} from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  author: string;
  initials: string;
  specialite: string;
  timestamp: string;
  content: string;
  mentions?: string[];
  attachments?: { name: string; type: 'image' | 'document'; size: string }[];
  isOwn?: boolean;
}

interface OnlineDoctor {
  name: string;
  initials: string;
  specialite: string;
  online: boolean;
}

/* ─── Static data ─── */
const onlineDoctors: OnlineDoctor[] = [
  { name: 'Dr. Martin Dupont',    initials: 'MD', specialite: 'Médecine Générale',    online: true  },
  { name: 'Dr. Sophie Laurent',   initials: 'SL', specialite: 'Cardiologie',           online: true  },
  { name: 'Dr. Jean Moreau',      initials: 'JM', specialite: 'Chirurgie viscérale',   online: true  },
  { name: 'Dr. Claire Petit',     initials: 'CP', specialite: 'Pédiatrie',             online: false },
  { name: 'Dr. Pierre Bernard',   initials: 'PB', specialite: 'Pneumologie',           online: false },
  { name: 'Dr. Amina Diallo',     initials: 'AD', specialite: 'Dermatologie',          online: true  },
  { name: 'Dr. François Leclerc', initials: 'FL', specialite: 'Neurologie',            online: false },
];

const initialMessages: ChatMessage[] = [
  {
    id: 'm1', author: 'Dr. Sophie Laurent', initials: 'SL', specialite: 'Cardiologie', timestamp: '09:12',
    content: "Bonjour à tous. J'aimerais avoir vos avis sur un cas : Homme 52 ans, hypertendu sous bithérapie, se présente avec une douleur thoracique rétrosternale constrictive depuis 2h. ECG montre un sus-décalage ST en V1-V4. Troponine en cours.",
  },
  {
    id: 'm2', author: 'Dr. Martin Dupont', initials: 'MD', specialite: 'Médecine Générale', timestamp: '09:15',
    content: '@Dr. Sophie Laurent Tableau typique de SCA ST+. La coronarographie en urgence s\'impose. Avez-vous initié la double antiagrégation ?',
    mentions: ['Dr. Sophie Laurent'], isOwn: true,
  },
  {
    id: 'm3', author: 'Dr. Jean Moreau', initials: 'JM', specialite: 'Chirurgie viscérale', timestamp: '09:18',
    content: "D'accord avec @Dr. Martin Dupont. Pensez aussi à vérifier la fonction rénale avant le produit de contraste. Le patient est hypertendu, il peut y avoir une néphropathie sous-jacente.",
    mentions: ['Dr. Martin Dupont'],
  },
  {
    id: 'm4', author: 'Dr. Amina Diallo', initials: 'AD', specialite: 'Dermatologie', timestamp: '09:22',
    content: "Question différente : j'ai une patiente, femme 35 ans, avec un érythème noueux bilatéral des jambes. Bilan inflammatoire positif. Quelles étiologies recherchez-vous en priorité ?",
  },
  {
    id: 'm5', author: 'Dr. Sophie Laurent', initials: 'SL', specialite: 'Cardiologie', timestamp: '09:25',
    content: '@Dr. Martin Dupont Oui, Aspirine + Ticagrélor administrés. Le patient est transféré en salle de cathétérisme. Merci ! 🙏',
    mentions: ['Dr. Martin Dupont'],
  },
  {
    id: 'm6', author: 'Dr. Martin Dupont', initials: 'MD', specialite: 'Médecine Générale', timestamp: '09:28',
    content: '@Dr. Amina Diallo Pour l\'érythème noueux : sarcoïdose (radio thorax + ECA), infections (IDR tuberculine, streptocoques), MICI, causes médicamenteuses. Un bilan auto-immun serait aussi pertinent.',
    mentions: ['Dr. Amina Diallo'], isOwn: true,
  },
  {
    id: 'm7', author: 'Dr. Amina Diallo', initials: 'AD', specialite: 'Dermatologie', timestamp: '09:32',
    content: 'Merci @Dr. Martin Dupont ! La radio thorax montre des adénopathies hilaires bilatérales. Je vais compléter avec le dosage de l\'ECA et un scanner thoracique.',
    mentions: ['Dr. Martin Dupont'],
    attachments: [{ name: 'radio_thorax_anonymise.jpg', type: 'image', size: '2.4 MB' }],
  },
  {
    id: 'm8', author: 'Dr. Pierre Bernard', initials: 'PB', specialite: 'Pneumologie', timestamp: '09:40',
    content: "En parlant de sarcoïdose, n'oubliez pas la fibroscopie bronchique avec LBA si le scanner confirme. Le rapport CD4/CD8 > 3.5 est un bon argument diagnostique.",
  },
];




/* ─── Color palette ─── */
const C = {
  primary:    '#163344',
  blue:       '#3b82f6',
  medical:    '#10b981',
  amber:      '#f59e0b',
  danger:     '#ef4444',
  gray50:     '#f9fafb',
  gray100:    '#f3f4f6',
  gray200:    '#e5e7eb',
  gray300:    '#d1d5db',
  gray400:    '#9ca3af',
  gray500:    '#6b7280',
  gray600:    '#4b5563',
  gray700:    '#374151',
  gray800:    '#1f2937',
  white:      '#ffffff',
};

/* ─── Tiny Avatar ─── */
const Avatar: React.FC<{ initials: string; own?: boolean; size?: number }> = ({
  initials, own, size = 36,
}) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: own
      ? `linear-gradient(135deg, ${C.blue}, #1d4ed8)`
      : `linear-gradient(135deg, ${C.primary}, #1e4d6b)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.3, fontWeight: 700, color: C.white,
  }}>
    {initials}
  </div>
);

/* ─── Render @mentions in bold ─── */
const RichText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(@Dr\.\s\w+\s\w+)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('@Dr.') ? (
          <span key={i} style={{ color: C.blue, fontWeight: 600, cursor: 'pointer' }}>{p}</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
};

/* ─── Main Component ─── */
const MedicalCommunity: React.FC = () => {
  const [messages, setMessages]       = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue]   = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [showEmojis, setShowEmojis]   = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; type: 'image' | 'document'; size: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const mentionRef     = useRef<HTMLDivElement>(null);
  const emojiRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Close popovers on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mentionRef.current && !mentionRef.current.contains(e.target as Node)) setShowMentions(false);
      if (emojiRef.current   && !emojiRef.current.contains(e.target as Node))   setShowEmojis(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim() && attachments.length === 0) return;
    const mentions = inputValue.match(/@Dr\.\s\w+\s\w+/g) || [];
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      author: 'Dr. Martin Dupont', initials: 'MD', specialite: 'Médecine Générale',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      content: inputValue,
      mentions: mentions.map(m => m.replace('@', '')),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      isOwn: true,
    }]);
    setInputValue('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const insertMention = (name: string) => {
    setInputValue(prev => prev + `@${name} `);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const insertEmoji = (emojiData: EmojiClickData) => {
    setInputValue(prev => prev + emojiData.emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments(prev => [...prev, ...Array.from(e.target.files!).map(f => ({
      name: f.name,
      type: (f.type.startsWith('image') ? 'image' : 'document') as 'image' | 'document',
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
    }))]);
    e.target.value = '';
  };

  const onlineCount = onlineDoctors.filter(d => d.online).length;

  return (
    <div className="page-content">
      {/* ── Page Header ── */}
      <div className="content-header-app">
        <div className="header-image" style={{
          background: 'linear-gradient(rgba(22,51,68,0.85), rgba(22,51,68,0.95)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
        }}>
          <div className="header-overlay">
            <h1>Communauté Médicale</h1>
            <p>Échangez sur des cas cliniques avec vos confrères</p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="content-body" style={{ paddingTop: 24 }}>
        <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 360px)', minHeight: 520 }}>

          {/* ════ CHAT PANEL ════ */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            background: C.white, borderRadius: 16,
            border: `1px solid ${C.gray200}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}>

            {/* Chat header */}
            <div style={{
              padding: '14px 20px', borderBottom: `1px solid ${C.gray100}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `linear-gradient(135deg, ${C.blue}20, ${C.blue}40)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AtSign size={18} color={C.blue} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.gray800 }}>
                    Discussion Clinique Générale
                  </div>
                  <div style={{ fontSize: 12, color: C.gray400 }}>
                    {onlineCount} médecins en ligne · {onlineDoctors.length} membres
                  </div>
                </div>
              </div>
              {/* Privacy badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#fffbeb', border: '1px solid #fde68a',
                borderRadius: 20, padding: '5px 12px',
                fontSize: 11, fontWeight: 600, color: '#b45309',
              }}>
                <ShieldAlert size={12} />
                Pas de données patient identifiables
              </div>
            </div>

            {/* Messages scroll area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {/* Disclaimer */}
              <div style={{
                background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10,
                padding: '10px 16px', textAlign: 'center', marginBottom: 20,
              }}>
                <div style={{ fontSize: 12, color: '#b45309', fontWeight: 600 }}>
                  ⚕️ Rappel : Anonymisez toujours les cas cliniques. Aucune donnée identifiable ne doit être partagée.
                </div>
                <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>
                  Ex : "Homme 52 ans, hypertendu" au lieu du nom du patient
                </div>
              </div>

              <AnimatePresence>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      display: 'flex', gap: 12, padding: '10px 10px',
                      borderRadius: 10, marginBottom: 2,
                      background: 'transparent',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.gray50)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Avatar initials={msg.initials} own={msg.isOwn} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                        <span style={{
                          fontSize: 13, fontWeight: 700,
                          color: msg.isOwn ? C.blue : C.gray800,
                        }}>
                          {msg.author}
                        </span>
                        <span style={{ fontSize: 11, color: C.gray400 }}>{msg.specialite}</span>
                        <span style={{ fontSize: 11, color: C.gray300 }}>{msg.timestamp}</span>
                      </div>
                      <p style={{
                        fontSize: 13, color: C.gray700, margin: 0,
                        lineHeight: 1.6, whiteSpace: 'pre-wrap',
                      }}>
                        <RichText text={msg.content} />
                      </p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                          {msg.attachments.map((att, i) => (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              background: C.gray50, border: `1px solid ${C.gray200}`,
                              borderRadius: 8, padding: '6px 12px', fontSize: 12,
                            }}>
                              {att.type === 'image'
                                ? <ImageIcon size={13} color={C.blue} />
                                : <FileText size={13} color={C.blue} />}
                              <span style={{ color: C.gray700, fontWeight: 500 }}>{att.name}</span>
                              <span style={{ color: C.gray400 }}>{att.size}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Attachment preview bar */}
            {attachments.length > 0 && (
              <div style={{
                padding: '8px 16px', borderTop: `1px solid ${C.gray100}`,
                background: C.gray50, display: 'flex', flexWrap: 'wrap', gap: 8,
              }}>
                {attachments.map((att, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: C.white, border: `1px solid ${C.gray200}`,
                    borderRadius: 8, padding: '5px 10px', fontSize: 12,
                  }}>
                    {att.type === 'image' ? <ImageIcon size={12} color={C.blue} /> : <FileText size={12} color={C.blue} />}
                    <span style={{ color: C.gray700 }}>{att.name}</span>
                    <button onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.gray400, padding: 0, display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input area */}
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.gray100}`, flexShrink: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'flex-end', gap: 8,
                background: C.gray50, borderRadius: 14,
                border: `1px solid ${C.gray200}`, padding: '8px 12px',
              }}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple
                  accept="image/*,.pdf,.doc,.docx" style={{ display: 'none' }} />

                {/* Attach */}
                <button onClick={() => fileInputRef.current?.click()}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.gray400, padding: '6px', display: 'flex', flexShrink: 0 }}
                  title="Joindre un fichier">
                  <Paperclip size={18} />
                </button>

                {/* Textarea */}
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrire un message... (Shift+Entrée pour saut de ligne)"
                  rows={1}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    resize: 'none', fontSize: 13, color: C.gray800, minHeight: 36,
                    maxHeight: 120, lineHeight: 1.5, paddingTop: 8, paddingBottom: 6,
                    fontFamily: 'inherit',
                  }}
                />

                {/* Mention popover */}
                <div ref={mentionRef} style={{ position: 'relative', flexShrink: 0 }}>
                  <button onClick={() => { setShowMentions(v => !v); setShowEmojis(false); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.gray400, padding: '6px', display: 'flex' }}
                    title="Mentionner un médecin">
                    <AtSign size={18} />
                  </button>
                  {showMentions && (
                    <div style={{
                      position: 'absolute', bottom: 42, right: 0, width: 260,
                      background: C.white, borderRadius: 12, border: `1px solid ${C.gray200}`,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, padding: 8,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.gray400, padding: '4px 8px 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Mentionner un médecin
                      </div>
                      {onlineDoctors.map(doc => (
                        <button key={doc.name} onClick={() => insertMention(doc.name)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: 'transparent', textAlign: 'left',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = C.gray50)}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Avatar initials={doc.initials} size={28} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: C.gray800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {doc.name}
                            </div>
                            <div style={{ fontSize: 11, color: C.gray400 }}>{doc.specialite}</div>
                          </div>
                          {doc.online && <Circle size={8} color={C.medical} fill={C.medical} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Emoji popover */}
                <div ref={emojiRef} style={{ position: 'relative', flexShrink: 0 }}>
                  <button onClick={() => { setShowEmojis(v => !v); setShowMentions(false); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.gray400, padding: '6px', display: 'flex' }}
                    title="Emojis">
                    <Smile size={18} />
                  </button>
                  {showEmojis && (
                    <div style={{
                      position: 'absolute', bottom: 48, right: 0,
                      zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                      borderRadius: 16, overflow: 'hidden',
                    }}>
                      <EmojiPicker
                        onEmojiClick={insertEmoji}
                        theme={Theme.LIGHT}
                        searchPlaceholder="Rechercher un emoji..."
                        width={320}
                        height={400}
                        lazyLoadEmojis
                      />
                    </div>
                  )}
                </div>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() && attachments.length === 0}
                  style={{
                    width: 36, height: 36, borderRadius: 10, border: 'none',
                    background: (!inputValue.trim() && attachments.length === 0) ? C.gray200 : C.blue,
                    color: C.white, cursor: (!inputValue.trim() && attachments.length === 0) ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'background 0.15s',
                  }}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* ════ ONLINE SIDEBAR ════ */}
          <div style={{
            width: 240, background: C.white, borderRadius: 16,
            border: `1px solid ${C.gray200}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
          }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.gray100}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.gray800 }}>Médecins en ligne</div>
              <div style={{ fontSize: 12, color: C.gray400, marginTop: 2 }}>{onlineCount} en ligne</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {/* Online */}
              {onlineDoctors.filter(d => d.online).map(doc => (
                <div key={doc.name} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 10, cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.gray50)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ position: 'relative' }}>
                    <Avatar initials={doc.initials} size={32} />
                    <Circle
                      size={9} fill={C.medical} color={C.medical}
                      style={{ position: 'absolute', bottom: -1, right: -1, background: C.white, borderRadius: '50%' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.gray800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.gray400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.specialite}
                    </div>
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div style={{ padding: '8px 10px 4px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.gray300, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Hors ligne
                </div>
              </div>

              {/* Offline */}
              {onlineDoctors.filter(d => !d.online).map(doc => (
                <div key={doc.name} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 10, cursor: 'pointer', opacity: 0.45,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.gray50)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Avatar initials={doc.initials} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.gray800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.gray400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.specialite}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalCommunity;
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { supabase } from '@/src/integrations/supabase/client';
import { Seo } from '@/components/Seo';

interface Thermometer {
  id: string;
  slug: string;
  client_name: string;
  client_logo_url: string;
  accent_color: string;
  welcome_title: string;
}

interface Question {
  id: string;
  order_index: number;
  question_text: string;
  left_label: string;
  left_icon: string;
  right_label: string;
  right_icon: string;
}

type Step = 'welcome' | 'question' | 'email' | 'celebration' | 'notfound';

function IconRender({ name, className }: { name: string; className?: string }) {
  if (!name) return null;
  const trimmed = name.trim();
  return <span className={className} style={{ fontSize: '1.5em', lineHeight: 1 }}>{trimmed}</span>;
}

const Termometro: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [thermo, setThermo] = useState<Thermometer | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState<Step>('welcome');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [transitioning, setTransitioning] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const confettiFiredRef = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!slug) return;
      const { data: t } = await supabase
        .from('thermometers')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (!alive) return;
      if (!t) {
        setStep('notfound');
        setLoading(false);
        return;
      }
      const { data: q } = await supabase
        .from('thermometer_questions')
        .select('*')
        .eq('thermometer_id', t.id)
        .order('order_index', { ascending: true });
      if (!alive) return;
      setThermo(t as any);
      setQuestions((q as any) || []);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const accent = thermo?.accent_color || '#000000';
  const cssVars = useMemo(() => ({ ['--thermo-accent' as any]: accent }), [accent]);

  const currentQuestion = questions[currentIdx];
  const currentValue = currentQuestion ? answers[currentQuestion.id] : undefined;

  function advance(next: () => void) {
    setTransitioning(true);
    setTimeout(() => {
      next();
      // small delay so DOM updates before fade-in
      requestAnimationFrame(() => setTransitioning(false));
    }, 280);
  }

  function handleNext() {
    if (currentValue === undefined) return;
    if (currentIdx < questions.length - 1) {
      advance(() => setCurrentIdx((i) => i + 1));
    } else {
      advance(() => setStep('email'));
    }
  }

  function handleBack() {
    if (currentIdx === 0) {
      advance(() => setStep('welcome'));
    } else {
      advance(() => setCurrentIdx((i) => i - 1));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Informe um e-mail válido.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        slug: thermo?.slug,
        client_email: email,
        answers: questions.map((q) => ({ question_id: q.id, value: answers[q.id] ?? 5 })),
      };
      const { data, error } = await supabase.functions.invoke('thermometer-submit', { body: payload });
      if (error || (data as any)?.error) {
        setErrorMsg('Não foi possível enviar agora. Tente novamente em instantes.');
        setSubmitting(false);
        return;
      }
      advance(() => setStep('celebration'));
    } catch {
      setErrorMsg('Não foi possível enviar agora. Tente novamente em instantes.');
    } finally {
      setSubmitting(false);
    }
  }

  // Confetti
  useEffect(() => {
    if (step !== 'celebration' || confettiFiredRef.current) return;
    confettiFiredRef.current = true;
    const colors = ['#D4AF37', '#F0D78C', '#C9A84C', '#FFFFFF'];
    const end = Date.now() + 1800;
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.6 },
      colors,
    });
  }, [step]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === 'notfound') {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-white text-center px-6 font-sans">
        <h1 className="font-serif text-4xl mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Termômetro não encontrado
        </h1>
        <p className="text-neutral-500 text-sm">Verifique o link e tente novamente.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] bg-white text-black font-sans"
      style={{ ...cssVars, fontFamily: "'Nunito Sans', sans-serif" }}
    >
      <Seo
        title={`${thermo?.client_name || 'Termômetro'} — Termômetro de Marca`}
        description="Questionário de personalidade de marca."
        robots="noindex, nofollow"
      />

      <div
        className="min-h-[100dvh] flex flex-col transition-all duration-300 ease-out"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(12px)' : 'translateY(0)',
        }}
      >
        {step === 'welcome' && thermo && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            {thermo.client_logo_url ? (
              <img
                src={thermo.client_logo_url}
                alt={thermo.client_name}
                className="max-h-24 max-w-[200px] object-contain mb-10"
              />
            ) : (
              <div className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">
                {thermo.client_name}
              </div>
            )}
            <h1
              className="text-4xl sm:text-5xl leading-tight max-w-xl mb-4"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {thermo.welcome_title || 'Termômetro de Marca'}
            </h1>
            <p className="text-neutral-500 text-sm max-w-sm mb-10">
              Algumas perguntas rápidas para revelar a personalidade da sua marca.
            </p>
            <button
              type="button"
              onClick={() => advance(() => setStep('question'))}
              className="min-w-[200px] px-8 py-4 text-white text-sm tracking-[0.2em] uppercase transition-opacity hover:opacity-90"
              style={{ background: accent }}
            >
              Começar
            </button>
          </div>
        )}

        {step === 'question' && currentQuestion && (
          <div className="flex-1 flex flex-col px-6 py-8 max-w-2xl w-full mx-auto">
            <div className="flex items-center justify-between text-xs tracking-[0.3em] uppercase text-neutral-400">
              <button onClick={handleBack} className="hover:text-black transition-colors">
                ← Voltar
              </button>
              <span>
                {currentIdx + 1} / {questions.length}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h2
                className="text-3xl sm:text-4xl leading-snug mb-12 text-center"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {currentQuestion.question_text}
              </h2>

              <div className="flex items-center justify-between mb-4 text-xs tracking-[0.2em] uppercase text-neutral-500">
                <div className="flex items-center gap-2 max-w-[45%]">
                  <IconRender name={currentQuestion.left_icon} className="w-5 h-5 shrink-0" />
                  <span>{currentQuestion.left_label}</span>
                </div>
                <div className="flex items-center gap-2 max-w-[45%] text-right justify-end">
                  <span>{currentQuestion.right_label}</span>
                  <IconRender name={currentQuestion.right_icon} className="w-5 h-5 shrink-0" />
                </div>
              </div>

              <div className="px-1 mb-6">
                <div className="flex justify-between gap-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => {
                    const active = currentValue !== undefined && v <= currentValue;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [currentQuestion.id]: v }))
                        }
                        aria-label={`Selecionar ${v} de 10`}
                        className="flex-1 h-10 rounded-full transition-all border"
                        style={{
                          background: active ? accent : 'transparent',
                          borderColor: active ? accent : '#E5E5E5',
                        }}
                      />
                    );
                  })}
                </div>
                <div className="mt-3 text-center text-xs text-neutral-400">
                  {currentValue ? `${currentValue} / 10` : 'Toque para selecionar'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentValue === undefined}
              className="min-w-[200px] mx-auto px-8 py-4 text-white text-sm tracking-[0.2em] uppercase transition-opacity disabled:opacity-30"
              style={{ background: accent }}
            >
              {currentIdx === questions.length - 1 ? 'Concluir' : 'Próxima'}
            </button>
          </div>
        )}

        {step === 'email' && (
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-md mx-auto w-full"
          >
            <h2
              className="text-3xl sm:text-4xl mb-8"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Para onde enviamos seu resultado?
            </h2>
            <input
              type="email"
              required
              aria-label="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full border-b border-neutral-300 py-3 text-center text-base focus:outline-none focus:border-black mb-6 bg-transparent"
            />
            {errorMsg && <p className="text-sm text-red-600 mb-4">{errorMsg}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="min-w-[220px] px-8 py-4 text-white text-sm tracking-[0.2em] uppercase transition-opacity disabled:opacity-50"
              style={{ background: accent }}
            >
              {submitting ? 'Enviando…' : 'Receber meu resultado'}
            </button>
          </form>
        )}

        {step === 'celebration' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(212,175,55,0.18) 0%, rgba(255,255,255,0) 60%)',
              }}
            />
            <h2
              className="text-4xl sm:text-5xl leading-tight max-w-xl relative"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Parabéns! <br />
              Agora você está a um passo de ter uma marca de impacto.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Termometro;
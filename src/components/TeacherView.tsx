import React, { useState } from 'react';
import { Quiz, Question, Attempt } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  ChefHat, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  ShieldAlert, 
  Save, 
  Eye, 
  X,
  FileText
} from 'lucide-react';

interface TeacherViewProps {
  quizzes: Quiz[];
  questions: Question[];
  attempts: Attempt[];
  onUpdateQuizzes: (updated: Quiz[]) => void;
  onUpdateQuestions: (updated: Question[]) => void;
}

interface ParsedCsvRow {
  rowNum: number;
  quizTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prompt: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  correct: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  isValid: boolean;
  error?: string;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  quizzes,
  questions,
  attempts,
  onUpdateQuizzes,
  onUpdateQuestions,
}) => {
  const { isTeacher, currentUser } = useAuth();

  // Navigation tab inside Teacher tools
  const [teacherTab, setTeacherTab] = useState<'editor' | 'csv' | 'settings'>('editor');
  const [selectedQuizId, setSelectedQuizId] = useState<string>(quizzes[0]?.id || '');

  // Question editing modal state
  const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [formPrompt, setFormPrompt] = useState('');
  const [formChoices, setFormChoices] = useState<[string, string, string, string]>(['', '', '', '']);
  const [formCorrect, setFormCorrect] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [formExplanation, setFormExplanation] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [formQuizId, setFormQuizId] = useState<string>(quizzes[0]?.id || '');
  const [alertMsg, setAlertMsg] = useState<{ type: 'error' | 'success' | 'warning'; text: string } | null>(null);

  // CSV Import State
  const [csvRawText, setCsvRawText] = useState('');
  const [csvParsedRows, setCsvParsedRows] = useState<ParsedCsvRow[]>([]);
  const [csvSummary, setCsvSummary] = useState<{ validCount: number; invalidCount: number } | null>(null);

  // 1. Role Guard: If player tries to access teacher console, return 403 Forbidden
  if (!isTeacher) {
    return (
      <div className="w-full max-w-xl mx-auto rounded-3xl bg-slate-900 border border-rose-500/30 p-8 text-center shadow-2xl animate-in fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-rose-200">403 Forbidden: Teacher Access Required</h2>
        <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          You are currently logged in as a <strong>Player</strong>. Teacher authoring tools and question management require teacher credentials.
        </p>
        <div className="mt-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400 max-w-sm mx-auto">
          Tip: Enter teacher password <code className="text-pink-300 font-mono font-bold">baker123</code> during login or toggle your role in the top-right <strong>More Options</strong> menu.
        </div>
      </div>
    );
  }

  // Filter questions for the selected quiz
  const currentQuizQuestions = questions.filter((q) => q.quizId === selectedQuizId);
  const currentQuizObj = quizzes.find((q) => q.id === selectedQuizId);

  // Open Create Question Modal
  const handleOpenCreate = () => {
    setEditingQuestionId(null);
    setFormPrompt('');
    setFormChoices(['', '', '', '']);
    setFormCorrect('A');
    setFormExplanation('');
    setFormDifficulty('Medium');
    setFormQuizId(selectedQuizId);
    setAlertMsg(null);
    setIsEditingQuestion(true);
  };

  // Open Edit Question Modal
  const handleOpenEdit = (q: Question) => {
    setEditingQuestionId(q.id);
    setFormPrompt(q.prompt);
    setFormChoices([
      q.choices[0]?.text || '',
      q.choices[1]?.text || '',
      q.choices[2]?.text || '',
      q.choices[3]?.text || '',
    ]);
    setFormCorrect(q.correctChoice);
    setFormExplanation(q.explanation || '');
    setFormDifficulty(q.difficulty || 'Medium');
    setFormQuizId(q.quizId);
    setAlertMsg(null);
    setIsEditingQuestion(true);
  };

  // Save or Update Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPrompt.trim() || formChoices.some((c) => !c.trim())) {
      setAlertMsg({ type: 'error', text: 'Prompt and all 4 choices are required.' });
      return;
    }

    const formattedChoices = [
      { id: `${Date.now()}-a`, label: 'A' as const, text: formChoices[0].trim() },
      { id: `${Date.now()}-b`, label: 'B' as const, text: formChoices[1].trim() },
      { id: `${Date.now()}-c`, label: 'C' as const, text: formChoices[2].trim() },
      { id: `${Date.now()}-d`, label: 'D' as const, text: formChoices[3].trim() },
    ];

    if (editingQuestionId) {
      // Edit existing
      const updated = questions.map((q) => {
        if (q.id === editingQuestionId) {
          return {
            ...q,
            quizId: formQuizId,
            prompt: formPrompt.trim(),
            choices: formattedChoices,
            correctChoice: formCorrect,
            explanation: formExplanation.trim(),
            difficulty: formDifficulty,
          };
        }
        return q;
      });
      onUpdateQuestions(updated);
      setAlertMsg({ type: 'success', text: 'Question updated successfully!' });
    } else {
      // Create new
      const newQuestion: Question = {
        id: `custom-q-${Date.now()}`,
        quizId: formQuizId,
        prompt: formPrompt.trim(),
        choices: formattedChoices,
        correctChoice: formCorrect,
        explanation: formExplanation.trim(),
        difficulty: formDifficulty,
        position: currentQuizQuestions.length + 1,
      };
      onUpdateQuestions([...questions, newQuestion]);

      // Update question count on the quiz object
      const updatedQuizzes = quizzes.map((qz) =>
        qz.id === formQuizId ? { ...qz, questionCount: qz.questionCount + 1 } : qz
      );
      onUpdateQuizzes(updatedQuizzes);
      setAlertMsg({ type: 'success', text: 'New question created and saved!' });
    }

    setIsEditingQuestion(false);
  };

  // Delete question with Phase 4 Guards:
  // Guard 1: Question in submitted attempts cannot be deleted (history protection)
  // Guard 2: >= 10-question gate: deleting below 10 automatically unpublishes the quiz
  const handleDeleteQuestion = (questionId: string) => {
    // Check Guard 1: History Protection
    const isAnsweredInAttempts = attempts.some((att) =>
      att.answers?.some((ans) => ans.questionId === questionId)
    );

    if (isAnsweredInAttempts) {
      setAlertMsg({
        type: 'warning',
        text: 'History Protection: This question appears in submitted attempts and cannot be deleted. You may edit its text instead.',
      });
      return;
    }

    const remainingForThisQuiz = currentQuizQuestions.filter((q) => q.id !== questionId);

    // Check Guard 2: 10-question gate
    if (remainingForThisQuiz.length < 10 && currentQuizObj?.published) {
      // Automatically unpublish quiz with warning
      const updatedQuizzes = quizzes.map((qz) =>
        qz.id === selectedQuizId ? { ...qz, published: false, questionCount: remainingForThisQuiz.length } : qz
      );
      onUpdateQuizzes(updatedQuizzes);
      setAlertMsg({
        type: 'warning',
        text: `Question deleted. Note: ${currentQuizObj.title} dropped below 10 questions and was automatically unpublished per spec rules.`,
      });
    } else {
      setAlertMsg({ type: 'success', text: 'Question deleted successfully.' });
    }

    onUpdateQuestions(questions.filter((q) => q.id !== questionId));
  };

  // Toggle Quiz Publication Status (with 10-question gate check)
  const handleTogglePublish = (quizId: string) => {
    const qCount = questions.filter((q) => q.quizId === quizId).length;
    const targetQuiz = quizzes.find((q) => q.id === quizId);
    if (!targetQuiz) return;

    if (!targetQuiz.published && qCount < 10) {
      setAlertMsg({
        type: 'error',
        text: `Cannot publish "${targetQuiz.title}". A quiz requires at least 10 valid questions to be published (currently has ${qCount}).`,
      });
      return;
    }

    const updated = quizzes.map((q) =>
      q.id === quizId ? { ...q, published: !q.published } : q
    );
    onUpdateQuizzes(updated);
    setAlertMsg({
      type: 'success',
      text: `"${targetQuiz.title}" is now ${!targetQuiz.published ? 'Published' : 'Unpublished (Draft)'}.`,
    });
  };

  // Change Time Limit Seconds
  const handleChangeTimeLimit = (quizId: string, seconds: number) => {
    const clamped = Math.max(15, Math.min(120, seconds));
    const updated = quizzes.map((q) =>
      q.id === quizId ? { ...q, timeLimitSeconds: clamped } : q
    );
    onUpdateQuizzes(updated);
  };

  // --- CSV Import Engine (Preview with Row-Level Validation per Phase 4) ---
  const handleParseCsv = (rawText: string) => {
    setCsvRawText(rawText);
    const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith('#'));
    
    if (lines.length <= 1) {
      setCsvParsedRows([]);
      setCsvSummary(null);
      return;
    }

    // Header check
    const dataLines = lines.slice(1);
    const parsed: ParsedCsvRow[] = [];
    let valid = 0;
    let invalid = 0;

    dataLines.forEach((line, index) => {
      const parts = line.split(',').map((p) => p.trim());
      const rowNum = index + 2; // Line in CSV
      
      const [quizTitle, difficulty, prompt, choiceA, choiceB, choiceC, choiceD, correct, explanation] = parts;

      let error = '';
      if (!quizTitle) error = 'Missing quiz title.';
      else if (!quizzes.some((q) => q.title.toLowerCase() === quizTitle.toLowerCase())) {
        error = `Quiz "${quizTitle}" not found. Must match an existing quiz.`;
      } else if (!prompt) {
        error = 'Missing question prompt.';
      } else if (!choiceA || !choiceB || !choiceC || !choiceD) {
        error = 'All 4 choices (A, B, C, D) are required.';
      } else if (!['A', 'B', 'C', 'D'].includes(correct?.toUpperCase())) {
        error = `Invalid correct answer "${correct}". Must be A, B, C, or D.`;
      }

      const isValid = error === '';
      if (isValid) valid += 1;
      else invalid += 1;

      parsed.push({
        rowNum,
        quizTitle: quizTitle || 'Unknown',
        difficulty: (['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium') as any,
        prompt: prompt || '',
        choiceA: choiceA || '',
        choiceB: choiceB || '',
        choiceC: choiceC || '',
        choiceD: choiceD || '',
        correct: (correct?.toUpperCase() as any) || 'A',
        explanation: explanation || '',
        isValid,
        error: error || undefined,
      });
    });

    setCsvParsedRows(parsed);
    setCsvSummary({ validCount: valid, invalidCount: invalid });
  };

  // Download Standard CSV Template
  const handleDownloadTemplate = () => {
    const csvContent = `# QuizWhiz / Brielle's Quiz CSV Import Template
# Valid Quiz Titles: ${quizzes.map((q) => q.title).join(' | ')}
quiz,difficulty,prompt,choiceA,choiceB,choiceC,choiceD,correct,explanation
French Pastry & Viennoiserie,Easy,What French pastry is made with choux dough and pearl sugar?,Pâte sablée,Chouquettes,Brioche,Palmier,B,Chouquettes are bite-sized baked choux puffs sprinkled with pearl sugar.
Cakes & Buttercreams,Medium,What cake uses whipped egg whites and cream of tartar with zero oil or yolks?,Pound Cake,Carrot Cake,Angel Food Cake,Red Velvet,C,Angel food cake contains zero fat and relies entirely on whipped egg white foam.
`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'quiz_questions_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Execute Confirmed Import
  const handleConfirmImport = () => {
    if (!csvSummary || csvSummary.invalidCount > 0) return;

    const newImportedQuestions: Question[] = csvParsedRows.map((row, idx) => {
      const targetQuiz = quizzes.find((q) => q.title.toLowerCase() === row.quizTitle.toLowerCase()) || quizzes[0];
      return {
        id: `csv-${Date.now()}-${idx}`,
        quizId: targetQuiz.id,
        prompt: row.prompt,
        choices: [
          { id: `c-${idx}-a`, label: 'A', text: row.choiceA },
          { id: `c-${idx}-b`, label: 'B', text: row.choiceB },
          { id: `c-${idx}-c`, label: 'C', text: row.choiceC },
          { id: `c-${idx}-d`, label: 'D', text: row.choiceD },
        ],
        correctChoice: row.correct,
        explanation: row.explanation,
        difficulty: row.difficulty,
        position: 100 + idx,
      };
    });

    onUpdateQuestions([...questions, ...newImportedQuestions]);

    // Update quiz question counts
    const updatedQuizzes = quizzes.map((q) => {
      const addedForThis = newImportedQuestions.filter((nq) => nq.quizId === q.id).length;
      return { ...q, questionCount: q.questionCount + addedForThis };
    });
    onUpdateQuizzes(updatedQuizzes);

    setAlertMsg({
      type: 'success',
      text: `Successfully imported ${newImportedQuestions.length} questions into your quiz bank!`,
    });
    setCsvRawText('');
    setCsvParsedRows([]);
    setCsvSummary(null);
    setTeacherTab('editor');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pink-950/40 border border-pink-500/40 flex items-center justify-center text-pink-300">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
                <span>Teacher Management Console</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Authenticated as <strong className="text-pink-300">{currentUser?.username}</strong> · Question Editor, Publication Gates &amp; Validated CSV Import.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTeacherTab('editor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                teacherTab === 'editor'
                  ? 'bg-pink-950/60 text-pink-300 border border-pink-500/50'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Question Editor
            </button>
            <button
              onClick={() => setTeacherTab('csv')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                teacherTab === 'csv'
                  ? 'bg-pink-950/60 text-pink-300 border border-pink-500/50'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              CSV Upload
            </button>
            <button
              onClick={() => setTeacherTab('settings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                teacherTab === 'settings'
                  ? 'bg-pink-950/60 text-pink-300 border border-pink-500/50'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Quiz Settings
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {alertMsg && (
          <div
            className={`mt-4 p-3.5 rounded-2xl border text-xs flex items-center justify-between animate-in fade-in ${
              alertMsg.type === 'error'
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                : alertMsg.type === 'warning'
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {alertMsg.type === 'error' && <XCircle className="w-4 h-4 flex-shrink-0" />}
              {alertMsg.type === 'warning' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
              {alertMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
              <span>{alertMsg.text}</span>
            </div>
            <button onClick={() => setAlertMsg(null)} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: QUESTION EDITOR */}
      {teacherTab === 'editor' && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Select Quiz:</span>
              <select
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-pink-400 cursor-pointer font-bold"
              >
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({questions.filter((item) => item.quizId === q.id).length} Qs)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-pink-300 hover:opacity-95 shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {currentQuizQuestions.map((q, idx) => {
              const isAnswered = attempts.some((att) =>
                att.answers?.some((ans) => ans.questionId === q.id)
              );

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-950/40 border border-sky-500/30 px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {q.difficulty || 'Medium'}
                        </span>
                        {isAnswered && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-950/50 text-amber-300 border border-amber-500/30">
                            Locked in Attempts
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-100">{q.prompt}</h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {q.choices.map((c) => (
                          <div
                            key={c.id}
                            className={`px-2.5 py-1.5 rounded-lg border text-[11px] truncate ${
                              c.label === q.correctChoice
                                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 font-bold'
                                : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                            }`}
                          >
                            <strong>{c.label})</strong> {c.text}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <p className="text-[11px] text-slate-400 pt-1 italic">
                          <strong className="text-sky-300 not-italic">Why: </strong>
                          {q.explanation}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEdit(q)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-300 transition-colors"
                        title="Edit question"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CSV BULK IMPORT WITH ROW-LEVEL PREVIEW & VALIDATION */}
      {teacherTab === 'csv' && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Upload className="w-5 h-5 text-pink-400" />
                <span>CSV Upload with Validation</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload or paste question data. Every row is verified before committing to the database.
              </p>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Download CSV Template</span>
            </button>
          </div>

          {/* Paste or Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Paste CSV Content
            </label>
            <textarea
              rows={6}
              placeholder="quiz,difficulty,prompt,choiceA,choiceB,choiceC,choiceD,correct,explanation..."
              value={csvRawText}
              onChange={(e) => handleParseCsv(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-4 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-pink-400 transition-colors"
            />
          </div>

          {/* Row-Level Pre-Commit Validation Summary */}
          {csvSummary && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-200">Validation Results:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {csvSummary.validCount} Valid
                  </span>
                  {csvSummary.invalidCount > 0 && (
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      {csvSummary.invalidCount} Invalid (Errors must be resolved)
                    </span>
                  )}
                </div>

                <button
                  disabled={csvSummary.invalidCount > 0 || csvSummary.validCount === 0}
                  onClick={handleConfirmImport}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-pink-300 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Import {csvSummary.validCount} Questions
                </button>
              </div>

              {/* Table of Parsed Rows */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 max-h-72">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-3">Row</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Quiz</th>
                      <th className="p-3">Prompt</th>
                      <th className="p-3">Correct</th>
                      <th className="p-3">Reason / Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60 font-mono text-[11px]">
                    {csvParsedRows.map((row) => (
                      <tr key={row.rowNum} className={row.isValid ? 'hover:bg-slate-800/30' : 'bg-rose-950/20'}>
                        <td className="p-3 font-bold text-slate-400">#{row.rowNum}</td>
                        <td className="p-3">
                          {row.isValid ? (
                            <span className="text-emerald-400 font-sans font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Valid
                            </span>
                          ) : (
                            <span className="text-rose-400 font-sans font-bold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" />
                              Error
                            </span>
                          )}
                        </td>
                        <td className="p-3 truncate max-w-[120px] font-sans">{row.quizTitle}</td>
                        <td className="p-3 truncate max-w-[200px] font-sans text-slate-200">{row.prompt}</td>
                        <td className="p-3 font-bold text-sky-300">{row.correct}</td>
                        <td className="p-3 font-sans text-slate-400">
                          {row.isValid ? 'Ready to import' : <span className="text-rose-300">{row.error}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QUIZ SETTINGS & 10-QUESTION PUBLICATION GATE */}
      {teacherTab === 'settings' && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <span>Quiz Settings &amp; Publication Gates</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure per-question time limits and publication state (strictly enforced: $\ge 10$ questions to publish).
            </p>
          </div>

          <div className="space-y-4">
            {quizzes.map((quiz) => {
              const qCount = questions.filter((q) => q.quizId === quiz.id).length;
              const canPublish = qCount >= 10;

              return (
                <div
                  key={quiz.id}
                  className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-bold text-slate-100">{quiz.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        quiz.published
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                      }`}>
                        {quiz.published ? 'Published' : 'Draft / Unpublished'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Contains <strong className="text-slate-200">{qCount}</strong> questions
                      {!canPublish && (
                        <span className="text-rose-400 ml-2 font-semibold">
                          (Need at least 10 to publish)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    {/* Time limit selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold">Timer:</span>
                      <select
                        value={quiz.timeLimitSeconds}
                        onChange={(e) => handleChangeTimeLimit(quiz.id, parseInt(e.target.value, 10))}
                        className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                      >
                        <option value={15}>15 seconds</option>
                        <option value={20}>20 seconds</option>
                        <option value={30}>30 seconds (Default)</option>
                        <option value={45}>45 seconds</option>
                        <option value={60}>60 seconds</option>
                        <option value={90}>90 seconds</option>
                      </select>
                    </div>

                    {/* Publish Toggle Button */}
                    <button
                      onClick={() => handleTogglePublish(quiz.id)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        quiz.published
                          ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md'
                      }`}
                    >
                      {quiz.published ? 'Unpublish' : 'Publish Quiz'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE / EDIT QUESTION MODAL */}
      {isEditingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />

            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-pink-400" />
                <span>{editingQuestionId ? 'Edit Question' : 'Create New Question'}</span>
              </h3>
              <button
                onClick={() => setIsEditingQuestion(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Assign to Quiz
                </label>
                <select
                  value={formQuizId}
                  onChange={(e) => setFormQuizId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                >
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Question Prompt
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter the question prompt..."
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Answer Choices &amp; Correct Answer
                </label>
                {(['A', 'B', 'C', 'D'] as const).map((label, idx) => (
                  <div key={label} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormCorrect(label)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                        formCorrect === label
                          ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                      title="Set as correct choice"
                    >
                      {label}
                    </button>
                    <input
                      type="text"
                      required
                      placeholder={`Choice ${label}`}
                      value={formChoices[idx]}
                      onChange={(e) => {
                        const copy = [...formChoices] as [string, string, string, string];
                        copy[idx] = e.target.value;
                        setFormChoices(copy);
                      }}
                      className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Educational Explanation (Shown after answering)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why the answer is correct..."
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingQuestion(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-pink-300 hover:opacity-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Question</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

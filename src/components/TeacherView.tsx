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
  ShieldAlert, 
  Save, 
  X
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
      <div className="w-full max-w-xl mx-auto rounded-3xl bg-white rococo-frame p-8 text-center shadow-2xl animate-in fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 border-2 border-rose-400 flex items-center justify-center text-rose-600 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-playfair font-black text-2xl text-neutral-900">403 Forbidden: Teacher Access Required</h2>
        <p className="text-xs text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
          You are currently logged in as a <strong>Player</strong>. Teacher authoring tools and question management require teacher credentials.
        </p>
        <div className="mt-5 p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-xs text-neutral-700 max-w-sm mx-auto">
          Tip: Enter teacher password <code className="text-pink-700 font-mono font-bold">baker123</code> during login or toggle your role in the top-right <strong>More Options</strong> menu.
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

  // Save Question Handler (Enforces 4 choices, 1 correct, non-empty text)
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formPrompt.trim()) {
      setAlertMsg({ type: 'error', text: 'Question prompt cannot be empty.' });
      return;
    }

    if (formChoices.some((c) => !c.trim())) {
      setAlertMsg({ type: 'error', text: 'All 4 answer choices (A, B, C, D) are required and must be non-empty.' });
      return;
    }

    if (!['A', 'B', 'C', 'D'].includes(formCorrect)) {
      setAlertMsg({ type: 'error', text: 'Please designate a valid correct choice (A, B, C, or D).' });
      return;
    }

    const formattedChoices = [
      { id: `${Date.now()}-A`, label: 'A' as const, text: formChoices[0].trim() },
      { id: `${Date.now()}-B`, label: 'B' as const, text: formChoices[1].trim() },
      { id: `${Date.now()}-C`, label: 'C' as const, text: formChoices[2].trim() },
      { id: `${Date.now()}-D`, label: 'D' as const, text: formChoices[3].trim() },
    ];

    if (editingQuestionId) {
      // Update existing question
      const updated = questions.map((q) => {
        if (q.id === editingQuestionId) {
          return {
            ...q,
            quizId: formQuizId,
            prompt: formPrompt.trim(),
            choices: formattedChoices,
            correctChoice: formCorrect,
            explanation: formExplanation.trim() || undefined,
            difficulty: formDifficulty,
          };
        }
        return q;
      });
      onUpdateQuestions(updated);
      setAlertMsg({ type: 'success', text: 'Question updated successfully!' });
    } else {
      // Create new question
      const newQuestion: Question = {
        id: `q-custom-${Date.now()}`,
        quizId: formQuizId,
        prompt: formPrompt.trim(),
        choices: formattedChoices,
        correctChoice: formCorrect,
        explanation: formExplanation.trim() || undefined,
        difficulty: formDifficulty,
        position: currentQuizQuestions.length + 1,
      };
      onUpdateQuestions([...questions, newQuestion]);

      // Update quiz questionCount
      const updatedQuizzes = quizzes.map((qz) =>
        qz.id === formQuizId ? { ...qz, questionCount: qz.questionCount + 1 } : qz
      );
      onUpdateQuizzes(updatedQuizzes);
      setAlertMsg({ type: 'success', text: 'New question added to quiz bank!' });
    }

    setIsEditingQuestion(false);
  };

  // Delete Question Handler (Safely guards questions tied to attempts and checks 10-question gate)
  const handleDeleteQuestion = (questionId: string) => {
    // Check Guard 1: Tied to attempts?
    const hasAttempts = attempts.some((att) =>
      att.answers?.some((ans) => ans.questionId === questionId)
    );

    if (hasAttempts) {
      setAlertMsg({
        type: 'warning',
        text: 'This question has active student attempts recorded. Deleting questions with attempt history is locked to preserve academic score integrity.',
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

    const dataLines = lines.slice(1);
    const parsed: ParsedCsvRow[] = [];
    let valid = 0;
    let invalid = 0;

    dataLines.forEach((line, index) => {
      const parts = line.split(',').map((p) => p.trim());
      const rowNum = index + 2;
      
      const [quizTitle, difficulty, prompt, choiceA, choiceB, choiceC, choiceD, correct, explanation] = parts;

      let error = '';
      if (!quizTitle) error = 'Missing quiz title.';
      else if (!prompt) error = 'Missing question prompt.';
      else if (!choiceA || !choiceB || !choiceC || !choiceD) error = 'Must provide all 4 choices (A, B, C, D).';
      else if (!['A', 'B', 'C', 'D'].includes(correct?.toUpperCase())) error = `Correct choice must be A, B, C, or D (got "${correct}").`;

      const isValid = error === '';
      if (isValid) valid += 1;
      else invalid += 1;

      parsed.push({
        rowNum,
        quizTitle: quizTitle || 'Untitled Quiz',
        difficulty: (['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium') as any,
        prompt: prompt || 'Empty prompt',
        choiceA: choiceA || '',
        choiceB: choiceB || '',
        choiceC: choiceC || '',
        choiceD: choiceD || '',
        correct: (correct?.toUpperCase() as any) || 'A',
        explanation: explanation || '',
        isValid,
        error,
      });
    });

    setCsvParsedRows(parsed);
    setCsvSummary({ validCount: valid, invalidCount: invalid });
  };

  const handleDownloadTemplate = () => {
    const templateContent = [
      'quiz_title,difficulty,prompt,choice_a,choice_b,choice_c,choice_d,correct_choice,explanation',
      '"Pastry Fundamentals",Medium,"What prevents pie crust from shrinking during pre-baking?","Chilling the dough","Adding warm water","Over-kneading","Higher sugar","A","Chilling dough relaxes the gluten network."',
      '"Science & Troubleshooting",Hard,"What chemical compound creates carbon dioxide with baking soda?","Acid (like buttermilk)","Sugar crystals","Salt","Cornstarch","A","Baking soda requires an acid to react and release CO2."',
    ].join('\n');

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'eclairwiz_quiz_questions_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = () => {
    if (!csvSummary || csvSummary.invalidCount > 0 || csvSummary.validCount === 0) return;

    const newImportedQuestions: Question[] = csvParsedRows.map((row, idx) => {
      let matchedQuiz = quizzes.find(
        (q) => q.title.toLowerCase().trim() === row.quizTitle.toLowerCase().trim()
      );
      const targetQuizId = matchedQuiz ? matchedQuiz.id : quizzes[0].id;

      return {
        id: `q-csv-${Date.now()}-${idx}`,
        quizId: targetQuizId,
        prompt: row.prompt,
        choices: [
          { id: `${Date.now()}-${idx}-A`, label: 'A', text: row.choiceA },
          { id: `${Date.now()}-${idx}-B`, label: 'B', text: row.choiceB },
          { id: `${Date.now()}-${idx}-C`, label: 'C', text: row.choiceC },
          { id: `${Date.now()}-${idx}-D`, label: 'D', text: row.choiceD },
        ],
        correctChoice: row.correct,
        explanation: row.explanation,
        difficulty: row.difficulty,
        position: 100 + idx,
      };
    });

    onUpdateQuestions([...questions, ...newImportedQuestions]);

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
      <div className="rounded-3xl bg-white/95 rococo-frame p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Ribbon Bow */}
        <div className="absolute -top-3 left-6 text-3xl select-none">
          🎀
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-pink-100 border-2 border-neutral-900 flex items-center justify-center text-pink-700 shadow-sm">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-playfair italic font-black text-2xl sm:text-3xl text-neutral-900 flex items-center gap-2">
                <span>Teacher Management Console</span>
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Authenticated as <strong className="text-pink-700 font-bold">{currentUser?.username}</strong> · Question Editor, Publication Gates &amp; Validated CSV Import.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTeacherTab('editor')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                teacherTab === 'editor'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-pink-50 text-neutral-700 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              Question Editor
            </button>
            <button
              onClick={() => setTeacherTab('csv')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                teacherTab === 'csv'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-pink-50 text-neutral-700 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              CSV Upload
            </button>
            <button
              onClick={() => setTeacherTab('settings')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                teacherTab === 'settings'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-pink-50 text-neutral-700 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              Quiz Settings
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {alertMsg && (
          <div
            className={`mt-4 p-3.5 rounded-2xl border-2 text-xs font-bold flex items-center justify-between animate-in fade-in ${
              alertMsg.type === 'error'
                ? 'bg-rose-100 border-rose-400 text-rose-900'
                : alertMsg.type === 'warning'
                ? 'bg-amber-100 border-amber-400 text-amber-900'
                : 'bg-emerald-100 border-emerald-400 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {alertMsg.type === 'error' && <XCircle className="w-4 h-4 flex-shrink-0" />}
              {alertMsg.type === 'warning' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
              {alertMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
              <span>{alertMsg.text}</span>
            </div>
            <button onClick={() => setAlertMsg(null)} className="text-neutral-500 hover:text-neutral-900 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: QUESTION EDITOR */}
      {teacherTab === 'editor' && (
        <div className="rounded-3xl bg-white/95 border-2 border-pink-200 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-pink-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-700">Select Quiz:</span>
              <select
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="bg-pink-50 border border-pink-300 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-pink-500 cursor-pointer font-bold"
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
              className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white bg-neutral-900 hover:bg-pink-600 shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto border border-pink-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question 🥐</span>
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
                  className="p-4 rounded-2xl bg-white border-2 border-pink-100 hover:border-pink-300 transition-colors shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-black text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                          {q.difficulty || 'Medium'}
                        </span>
                        {isAnswered && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            Locked in Attempts
                          </span>
                        )}
                      </div>

                      <h4 className="font-playfair font-bold text-sm text-neutral-900">{q.prompt}</h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {q.choices.map((c) => (
                          <div
                            key={c.id}
                            className={`px-2.5 py-1.5 rounded-xl border text-[11px] truncate ${
                              c.label === q.correctChoice
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                                : 'bg-pink-50/50 border-pink-200 text-neutral-700'
                            }`}
                          >
                            <strong>{c.label})</strong> {c.text}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <p className="text-[11px] text-neutral-600 pt-1 italic">
                          <strong className="text-pink-700 not-italic font-bold">Why: </strong>
                          {q.explanation}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEdit(q)}
                        className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-neutral-700 hover:text-neutral-900 border border-pink-200 transition-colors cursor-pointer"
                        title="Edit question"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 rounded-full bg-pink-50 hover:bg-rose-100 text-neutral-600 hover:text-rose-600 border border-pink-200 transition-colors cursor-pointer"
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
        <div className="rounded-3xl bg-white/95 border-2 border-pink-200 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-pink-100">
            <div>
              <h3 className="font-playfair font-bold text-xl text-neutral-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-pink-600" />
                <span>CSV Upload with Row-Level Validation</span>
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Upload or paste question data. Every row is verified before committing to the database.
              </p>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-pink-50 hover:bg-pink-100 text-neutral-800 border border-pink-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-4 h-4 text-pink-600" />
              <span>Download CSV Template</span>
            </button>
          </div>

          {/* Paste or Upload Area */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-2">
              Paste CSV Content
            </label>
            <textarea
              rows={6}
              placeholder="quiz,difficulty,prompt,choiceA,choiceB,choiceC,choiceD,correct,explanation..."
              value={csvRawText}
              onChange={(e) => handleParseCsv(e.target.value)}
              className="w-full bg-pink-50/50 border-2 border-pink-200 rounded-2xl p-4 font-mono text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Row-Level Pre-Commit Validation Summary */}
          {csvSummary && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-neutral-900">Validation Results:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {csvSummary.validCount} Valid
                  </span>
                  {csvSummary.invalidCount > 0 && (
                    <span className="text-rose-700 font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      {csvSummary.invalidCount} Invalid (Errors must be resolved)
                    </span>
                  )}
                </div>

                <button
                  disabled={csvSummary.invalidCount > 0 || csvSummary.validCount === 0}
                  onClick={handleConfirmImport}
                  className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white bg-neutral-900 hover:bg-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Import {csvSummary.validCount} Questions
                </button>
              </div>

              {/* Table of Parsed Rows */}
              <div className="overflow-x-auto rounded-2xl border-2 border-pink-200 max-h-72">
                <table className="w-full text-left text-xs text-neutral-800">
                  <thead className="bg-pink-100 text-[11px] uppercase tracking-wider text-neutral-700 font-black">
                    <tr>
                      <th className="p-3">Row</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Quiz</th>
                      <th className="p-3">Prompt</th>
                      <th className="p-3">Correct</th>
                      <th className="p-3">Reason / Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100 bg-white font-mono text-[11px]">
                    {csvParsedRows.map((row) => (
                      <tr key={row.rowNum} className={row.isValid ? 'hover:bg-pink-50/50' : 'bg-rose-50'}>
                        <td className="p-3 font-bold text-neutral-600">#{row.rowNum}</td>
                        <td className="p-3">
                          {row.isValid ? (
                            <span className="text-emerald-700 font-sans font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Valid
                            </span>
                          ) : (
                            <span className="text-rose-700 font-sans font-bold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" />
                              Error
                            </span>
                          )}
                        </td>
                        <td className="p-3 truncate max-w-[120px] font-sans">{row.quizTitle}</td>
                        <td className="p-3 truncate max-w-[200px] font-sans text-neutral-900">{row.prompt}</td>
                        <td className="p-3 font-bold text-pink-700">{row.correct}</td>
                        <td className="p-3 font-sans text-neutral-600">
                          {row.isValid ? 'Ready to import' : <span className="text-rose-700 font-bold">{row.error}</span>}
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
        <div className="rounded-3xl bg-white/95 border-2 border-pink-200 p-6 sm:p-8 shadow-md space-y-6">
          <div className="pb-4 border-b-2 border-pink-100">
            <h3 className="font-playfair font-bold text-xl text-neutral-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-pink-600" />
              <span>Quiz Settings &amp; Publication Gates</span>
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Configure per-question time limits and publication state (strictly enforced: at least 10 questions to publish).
            </p>
          </div>

          <div className="space-y-4">
            {quizzes.map((quiz) => {
              const qCount = questions.filter((q) => q.quizId === quiz.id).length;
              const canPublish = qCount >= 10;

              return (
                <div
                  key={quiz.id}
                  className="p-5 rounded-2xl bg-white border-2 border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-playfair font-bold text-base text-neutral-900">{quiz.title}</h4>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        quiz.published
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {quiz.published ? 'Published' : 'Draft / Unpublished'}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-600">
                      Contains <strong className="text-neutral-900 font-bold">{qCount}</strong> questions
                      {!canPublish && (
                        <span className="text-rose-700 ml-2 font-bold">
                          (Need at least 10 to publish)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    {/* Time limit selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-700 font-bold">Timer:</span>
                      <select
                        value={quiz.timeLimitSeconds}
                        onChange={(e) => handleChangeTimeLimit(quiz.id, parseInt(e.target.value, 10))}
                        className="bg-pink-50 border border-pink-300 rounded-xl px-2.5 py-1.5 text-xs text-neutral-900 font-bold focus:outline-none focus:border-pink-500 cursor-pointer"
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
                      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        quiz.published
                          ? 'bg-pink-100 hover:bg-pink-200 text-neutral-900 border border-pink-300'
                          : 'bg-neutral-900 hover:bg-pink-600 text-white shadow-xs'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] bg-white border-4 border-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between mb-4 flex-shrink-0 pb-3 border-b-2 border-pink-100">
              <h3 className="font-playfair font-bold text-lg text-neutral-900 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-pink-600" />
                <span>{editingQuestionId ? 'Edit Question' : 'Create New Question'}</span>
              </h3>
              <button
                onClick={() => setIsEditingQuestion(false)}
                className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-pink-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1">
                  Assign to Quiz
                </label>
                <select
                  value={formQuizId}
                  onChange={(e) => setFormQuizId(e.target.value)}
                  className="w-full bg-pink-50 border border-pink-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-bold focus:outline-none focus:border-pink-500"
                >
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1">
                  Question Prompt
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter the baking trivia prompt..."
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  className="w-full bg-pink-50/50 border-2 border-pink-200 rounded-xl p-3 text-xs text-neutral-900 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-700">
                  Answer Choices &amp; Correct Answer
                </label>
                {(['A', 'B', 'C', 'D'] as const).map((label, idx) => (
                  <div key={label} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormCorrect(label)}
                      className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                        formCorrect === label
                          ? 'bg-neutral-900 text-white ring-2 ring-pink-400'
                          : 'bg-pink-100 text-neutral-700 border border-pink-300'
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
                      className="flex-1 bg-pink-50/50 border-2 border-pink-200 rounded-xl px-3 py-1.5 text-xs text-neutral-900 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1">
                  Educational Explanation (Shown after answering)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why the answer is correct..."
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  className="w-full bg-pink-50/50 border-2 border-pink-200 rounded-xl p-3 text-xs text-neutral-900 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t-2 border-pink-100 flex justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingQuestion(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white bg-neutral-900 hover:bg-pink-600 shadow-xs flex items-center gap-1.5 cursor-pointer border border-pink-200"
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

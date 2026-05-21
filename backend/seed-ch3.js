require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function seedData() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pathobondhu',
    charset: 'utf8mb4'
  });

  console.log('✅ Database connected!\n');

  const CHAPTER_ID = 3;

  // File পড়ো
  const filePath = path.join(__dirname, '../data/raw/ch3_MASTER.txt');
<<<<<<< HEAD
  const fileContent = fs.readFileSync(filePath, 'utf8');
=======
  const fileContent = fs.readFileSync(filePath, 'utf8').replace(/\r/g, '');
>>>>>>> origin/main

  // ================================================
  // HELPER: importance string → number
  // ================================================
  function importanceRank(str) {
    if (!str) return 1;
    const s = str.trim().toLowerCase();
    if (s === 'high') return 3;
    if (s === 'medium') return 2;
    return 1;
  }

  // ================================================
  // HELPER: Section কেটে বের করো
  // ================================================
  function getSection(content, startMarker, endMarker) {
    const start = content.indexOf(startMarker);
    if (start === -1) return '';
    const from = start + startMarker.length;
    if (!endMarker) return content.slice(from);
    const end = content.indexOf(endMarker, from);
    return end === -1 ? content.slice(from) : content.slice(from, end);
  }

  // ================================================
  // CONCEPTS PARSE
  // ================================================
  console.log('📚 Concepts parse করছি...');

  const conceptsRaw = getSection(fileContent, '=== CONCEPTS ===', '=== FORMULAS ===');
  const lines = conceptsRaw.split('\n');

  // প্রতিটা CONCEPT_N_FIELD: value collect করো
  // Multi-line value support করতে হবে
  const conceptMap = {}; // { '1': { TITLE, CONTENT, EXAMPLE, IMPORTANCE, REASON }, ... }

  let currentId = null;
  let currentField = null;

  for (const line of lines) {
    // CONCEPT_12_TITLE: ... বা CONCEPT_1_IMPORTANCE: ...
    const match = line.match(/^CONCEPT_(\d+)_([A-Z]+):\s*(.*)$/);
    if (match) {
      const [, num, field, value] = match;
      currentId = num;
      currentField = field;
      if (!conceptMap[num]) conceptMap[num] = {};
      conceptMap[num][field] = value.trim();
    } else if (currentId && currentField && line.trim() !== '') {
      // Multi-line continuation — CONCEPT_ দিয়ে শুরু না হলে আগের field এ যোগ করো
      if (!line.match(/^CONCEPT_\d+_/)) {
        conceptMap[currentId][currentField] += '\n' + line.trim();
      }
    }
  }

  // Insert concepts
  let conceptOrder = 1;
  const sortedConceptIds = Object.keys(conceptMap).sort((a, b) => parseInt(a) - parseInt(b));

  for (const id of sortedConceptIds) {
    const c = conceptMap[id];
    if (!c.TITLE) continue;

<<<<<<< HEAD
=======
    // Check if already exists
    const [existing] = await db.execute(
      'SELECT 1 FROM math_concepts WHERE chapter_id = ? AND module_title = ?',
      [CHAPTER_ID, c.TITLE]
    );

    if (existing.length > 0) {
      console.log(`  ⚠️ Concept ${id} is already inserted: ${c.TITLE}`);
      continue;
    }

>>>>>>> origin/main
    await db.execute(
      `INSERT INTO math_concepts 
       (chapter_id, module_title, content, examples, importance_rank, source, display_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        CHAPTER_ID,
        c.TITLE || '',
        c.CONTENT || '',
        c.EXAMPLE || '',
        importanceRank(c.IMPORTANCE),
        'nctb_board_book',
        conceptOrder++
      ]
    );
    console.log(`  ✓ Concept ${id}: ${c.TITLE}`);
  }

  // ================================================
  // FORMULAS PARSE
  // ================================================
  console.log('\n📐 Formulas parse করছি...');

  const formulasRaw = getSection(fileContent, '=== FORMULAS ===', '=== EXERCISE 3.1 ===');
  const fLines = formulasRaw.split('\n');

  // FORMULA_1: value
  // FORMULA_1_WHEN: value
  // FORMULA_1_VARIABLES: value
  // FORMULA_1_IMPORTANCE: value
  const formulaMap = {}; // { '1': { VALUE, WHEN, VARIABLES, IMPORTANCE }, ... }

  for (const line of fLines) {
    // FORMULA_1: (a+b)^2 = ...   → field name খালি
    const mainMatch = line.match(/^FORMULA_(\d+):\s*(.+)$/);
    if (mainMatch) {
      const [, num, value] = mainMatch;
      if (!formulaMap[num]) formulaMap[num] = {};
      formulaMap[num]['VALUE'] = value.trim();
      continue;
    }

    // FORMULA_1_WHEN: ...
    const subMatch = line.match(/^FORMULA_(\d+)_([A-Z]+):\s*(.+)$/);
    if (subMatch) {
      const [, num, field, value] = subMatch;
      if (!formulaMap[num]) formulaMap[num] = {};
      formulaMap[num][field] = value.trim();
    }
  }

  let formulaOrder = 1;
  const sortedFormulaIds = Object.keys(formulaMap).sort((a, b) => parseInt(a) - parseInt(b));

  for (const id of sortedFormulaIds) {
    const f = formulaMap[id];
    if (!f.VALUE) continue;

<<<<<<< HEAD
=======
    // Check if already exists
    const [existing] = await db.execute(
      'SELECT 1 FROM math_formulas WHERE chapter_id = ? AND formula_text = ?',
      [CHAPTER_ID, f.VALUE]
    );

    if (existing.length > 0) {
      console.log(`  ⚠️ Formula ${id} is already inserted: ${f.VALUE}`);
      continue;
    }

>>>>>>> origin/main
    await db.execute(
      `INSERT INTO math_formulas 
       (chapter_id, formula_text, when_to_use, variables_explanation, importance_rank, source, display_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        CHAPTER_ID,
        f.VALUE,
        f.WHEN || '',
        f.VARIABLES || '',
        importanceRank(f.IMPORTANCE),
        'nctb_board_book',
        formulaOrder++
      ]
    );
    console.log(`  ✓ Formula ${id}: ${f.VALUE}`);
  }

  // ================================================
  // EXERCISES PARSE
  // ================================================
  const exerciseNums = ['3.1', '3.2', '3.3', '3.4', '3.5'];

  for (let i = 0; i < exerciseNums.length; i++) {
    const exNum = exerciseNums[i];
    const startMarker = `=== EXERCISE ${exNum} ===`;
    const endMarker = i + 1 < exerciseNums.length
      ? `=== EXERCISE ${exerciseNums[i + 1]} ===`
      : '========================================';

    const exRaw = getSection(fileContent, startMarker, endMarker);
    if (!exRaw.trim()) {
      console.log(`\n  ⚠️  Exercise ${exNum} পাওয়া যায়নি`);
      continue;
    }

    console.log(`\n📝 Exercise ${exNum} parse করছি...`);

    const exLines = exRaw.split('\n');

    // Q1_TEXT: ..., Q1_PATTERN: ...
    // Multi-line TEXT support
    const questionMap = {}; // { '1': { TEXT, PATTERN }, ... }
    let curQId = null;
    let curQField = null;

    for (const line of exLines) {
      const match = line.match(/^Q(\d+)_([A-Z]+):\s*(.*)$/);
      if (match) {
        const [, num, field, value] = match;
        curQId = num;
        curQField = field;
        if (!questionMap[num]) questionMap[num] = {};
        questionMap[num][field] = value.trim();
      } else if (curQId && curQField && line.trim() !== '') {
        if (!line.match(/^Q\d+_/)) {
          // Multi-line continuation
          questionMap[curQId][curQField] += '\n' + line.trim();
        }
      }
    }

    let qOrder = 1;
    const sortedQIds = Object.keys(questionMap).sort((a, b) => parseInt(a) - parseInt(b));

    for (const qId of sortedQIds) {
      const q = questionMap[qId];
      if (!q.TEXT) continue;

<<<<<<< HEAD
=======
      // Check if already exists
      const [existing] = await db.execute(
        'SELECT 1 FROM math_exercises WHERE chapter_id = ? AND exercise_number = ? AND question_text = ?',
        [CHAPTER_ID, exNum, q.TEXT]
      );

      if (existing.length > 0) {
        console.log(`  ⚠️ Exercise ${exNum} - Q${qId} is already inserted`);
        continue;
      }

>>>>>>> origin/main
      await db.execute(
        `INSERT INTO math_exercises 
         (chapter_id, exercise_number, question_text, question_pattern,
          mention_count, frequency_module, source, display_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          CHAPTER_ID,
          exNum,
          q.TEXT,
          q.PATTERN || 'OTHER',
          0,
          'less_asked',
          'nctb_board_book',
          qOrder++
        ]
      );
      console.log(`  ✓ Exercise ${exNum} - Q${qId}`);
    }
  }

  // ================================================
  // SUMMARY
  // ================================================
  const [[{ cCount }]] = await db.execute(
    'SELECT COUNT(*) as cCount FROM math_concepts WHERE chapter_id = ?', [CHAPTER_ID]
  );
  const [[{ fCount }]] = await db.execute(
    'SELECT COUNT(*) as fCount FROM math_formulas WHERE chapter_id = ?', [CHAPTER_ID]
  );
  const [[{ eCount }]] = await db.execute(
    'SELECT COUNT(*) as eCount FROM math_exercises WHERE chapter_id = ?', [CHAPTER_ID]
  );

  console.log('\n========================================');
  console.log('✅ সব data successfully insert হয়েছে!');
  console.log(`📚 Concepts  : ${cCount}`);
  console.log(`📐 Formulas  : ${fCount}`);
  console.log(`📝 Exercises : ${eCount}`);
  console.log('========================================');

  await db.end();
}

seedData().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function seedGuideData() {
<<<<<<< HEAD
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pathobondhu',
    charset: 'utf8mb4'
  });

  console.log('✅ Database connected!\n');

  const CHAPTER_ID = 3;

  function getSection(content, startMarker, endMarker) {
    const start = content.indexOf(startMarker);
    if (start === -1) return '';
    const from = start + startMarker.length;
    if (!endMarker) return content.slice(from);
    const end = content.indexOf(endMarker, from);
    return end === -1 ? content.slice(from) : content.slice(from, end);
  }

  // ================================================
  // PART 1: SOLUTIONS
  // ================================================
  console.log('📝 Solutions parse করছি...\n');

  const solutionsPath = path.join(__dirname, '../data/raw/ch3_solutions_MASTER.txt');
  const solutionsContent = fs.readFileSync(solutionsPath, 'utf8');

  const exerciseSections = [
    { exNum: '3.1', start: '=== EXERCISE 3.1 SOLUTIONS ===', end: '=== EXERCISE 3.2 SOLUTIONS ===' },
    { exNum: '3.2', start: '=== EXERCISE 3.2 SOLUTIONS ===', end: '=== EXERCISE 3.3 SOLUTIONS ===' },
    { exNum: '3.3', start: '=== EXERCISE 3.3 SOLUTIONS ===', end: '=== EXERCISE 3.4 SOLUTIONS ===' },
    { exNum: '3.4', start: '=== EXERCISE 3.4 SOLUTIONS ===', end: '=== EXERCISE 3.5 SOLUTIONS (Part 1) ===' },
    { exNum: '3.5', start: null, end: null }, // special handling
  ];

  for (const { exNum, start, end } of exerciseSections) {
    let sectionRaw = '';

    if (exNum === '3.5') {
      const part1 = getSection(solutionsContent, '=== EXERCISE 3.5 SOLUTIONS (Part 1) ===', '=== EXERCISE 3.5 SOLUTIONS (Part 2) ===');
      const part2 = getSection(solutionsContent, '=== EXERCISE 3.5 SOLUTIONS (Part 2) ===', '========================================');
      sectionRaw = part1 + '\n' + part2;
    } else {
      sectionRaw = getSection(solutionsContent, start, end);
    }

    if (!sectionRaw.trim()) {
      console.log(`  ⚠️  Exercise ${exNum} solutions পাওয়া যায়নি`);
      continue;
    }

    console.log(`  Exercise ${exNum} solutions processing...`);

    const lines = sectionRaw.split('\n');
    const solutionMap = {};
    let currentQNum = null;
    let currentBuffer = [];

    const flushBuffer = () => {
      if (currentQNum && currentBuffer.length > 0) {
        if (!solutionMap[currentQNum]) solutionMap[currentQNum] = '';
        solutionMap[currentQNum] += currentBuffer.join('\n') + '\n';
        currentBuffer = [];
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();

      const solMatch = trimmed.match(/^Q(\d+)[A-Z]?_SOLUTION:\s*(.*)$/);
      if (solMatch) {
        const [, num, rest] = solMatch;
        if (num !== currentQNum) {
          flushBuffer();
          currentQNum = num;
        }
        if (rest.trim()) currentBuffer.push(rest.trim());
        continue;
      }

      const stepMatch = trimmed.match(/^(?:\(.*?\)\s*)?STEP_(\d+):\s*(.+)$/);
      if (stepMatch && currentQNum) {
        currentBuffer.push(`ধাপ ${stepMatch[1]}: ${stepMatch[2].trim()}`);
        continue;
      }

      const ansMatch = trimmed.match(/^FINAL_ANSWER:\s*(.+)$/);
      if (ansMatch && currentQNum) {
        currentBuffer.push(`উত্তর: ${ansMatch[1].trim()}`);
        continue;
      }
    }

    flushBuffer();

    for (const [qNum, solutionText] of Object.entries(solutionMap)) {
      const displayOrder = parseInt(qNum);

      const [rows] = await db.execute(
        `SELECT exercise_id FROM math_exercises 
         WHERE chapter_id = ? AND exercise_number = ? AND display_order = ?`,
        [CHAPTER_ID, exNum, displayOrder]
      );

      if (rows.length > 0) {
        await db.execute(
          `UPDATE math_exercises SET solution_steps = ? WHERE exercise_id = ?`,
          [solutionText.trim(), rows[0].exercise_id]
        );
        console.log(`    ✓ Exercise ${exNum} Q${qNum} updated`);
      } else {
        console.log(`    ⚠️  Exercise ${exNum} Q${qNum} not found in DB`);
      }
    }
  }

  // ================================================
  // PART 2: SRIJONSHIL
  // ================================================
  console.log('\n\n📖 Srijonshil parse করছি...');

  const srijonshilPath = path.join(__dirname, '../data/raw/ch3_srijonshil_MASTER.txt');
  const srijonshilContent = fs.readFileSync(srijonshilPath, 'utf8');

  // Exact markers from file
  const boardSection = getSection(srijonshilContent, '=== BOARD QUESTIONS ===', '=== GUIDE + MODEL TEST QUESTIONS ===');
  const guideSection = getSection(srijonshilContent, '=== GUIDE + MODEL TEST QUESTIONS ===', '========================================');

  async function parseSrijonshil(content, sourceType) {
    if (!content.trim()) {
      console.log(`  ⚠️  ${sourceType} section পাওয়া যায়নি`);
      return;
    }

    const lines = content.split('\n');
    const cqMap = {};
    let currentCQ = null;
    let currentField = null;
    let currentBuffer = [];

    const flushCQBuffer = () => {
      if (currentCQ && currentField && currentBuffer.length > 0) {
        if (!cqMap[currentCQ]) cqMap[currentCQ] = {};
        cqMap[currentCQ][currentField] = currentBuffer.join('\n').trim();
        currentBuffer = [];
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();

      const fieldMatch = trimmed.match(/^CQ(\d+)_(SOURCE|UDDIPOK|Q_KA|Q_KHA|Q_GA|Q_GHA|ANS_KA|ANS_KHA|ANS_GA|ANS_GHA):\s*(.*)$/);
      if (fieldMatch) {
        const [, num, field, value] = fieldMatch;
        if (num !== currentCQ || field !== currentField) {
          flushCQBuffer();
          currentCQ = num;
          currentField = field;
        }
        if (value.trim()) currentBuffer.push(value.trim());
        continue;
      }

      const stepMatch = trimmed.match(/^(?:\(.*?\)\s*)?STEP_(\d+):\s*(.+)$/);
      if (stepMatch && currentCQ && currentField && currentField.startsWith('ANS_')) {
        currentBuffer.push(`ধাপ ${stepMatch[1]}: ${stepMatch[2].trim()}`);
        continue;
      }

      const ansMatch = trimmed.match(/^FINAL_ANSWER:\s*(.+)$/);
      if (ansMatch && currentCQ && currentField) {
        currentBuffer.push(`উত্তর: ${ansMatch[1].trim()}`);
        continue;
      }
    }

    flushCQBuffer();

    const sortedCQIds = Object.keys(cqMap).sort((a, b) => parseInt(a) - parseInt(b));
    let order = 1;

    for (const cqId of sortedCQIds) {
      const cq = cqMap[cqId];
      if (!cq.Q_KA) continue;

      const source = cq.SOURCE || '';
      let boardId = null;
      if (source.includes('ঢাকা')) boardId = 1;
      else if (source.includes('চট্টগ্রাম')) boardId = 2;
      else if (source.includes('রাজশাহী')) boardId = 3;
      else if (source.includes('যশোর')) boardId = 4;
      else if (source.includes('কুমিল্লা')) boardId = 5;
      else if (source.includes('সিলেট')) boardId = 6;
      else if (source.includes('বরিশাল')) boardId = 7;
      else if (source.includes('দিনাজপুর')) boardId = 8;
      else if (source.includes('ময়মনসিংহ')) boardId = 9;

      const yearMatch = source.match(/(\d{4})/);
      const examYear = yearMatch ? parseInt(yearMatch[1]) : null;

      const parts = [
        { qField: 'Q_KA',  ansField: 'ANS_KA',  part: 'ক' },
        { qField: 'Q_KHA', ansField: 'ANS_KHA', part: 'খ' },
        { qField: 'Q_GA',  ansField: 'ANS_GA',  part: 'গ' },
        { qField: 'Q_GHA', ansField: 'ANS_GHA', part: 'ঘ' },
      ];

      for (const { qField, ansField, part } of parts) {
        if (!cq[qField]) continue;

        await db.execute(
          `INSERT INTO math_srijonshil
           (chapter_id, category, uddipok_text, question_text, solution,
            board_id, exam_year, source_name, source_type, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            CHAPTER_ID,
            part,
            cq.UDDIPOK || '',
            cq[qField],
            cq[ansField] || '',
            boardId,
            examYear,
            source,
            sourceType === 'board' ? 'board' : 'guide_model',
            order++
          ]
        );
        console.log(`  ✓ CQ${cqId} (${part}) [${sourceType}] — ${source}`);
      }
    }
  }

  console.log('\n  📌 Board questions:');
  await parseSrijonshil(boardSection, 'board');

  console.log('\n  📌 Guide/Model test questions:');
  await parseSrijonshil(guideSection, 'guide');

  // ================================================
  // SUMMARY
  // ================================================
  const [[{ eWithSol }]] = await db.execute(
    `SELECT COUNT(*) as eWithSol FROM math_exercises 
     WHERE chapter_id = ? AND solution_steps IS NOT NULL AND solution_steps != ''`,
    [CHAPTER_ID]
  );
  const [[{ srBoard }]] = await db.execute(
    `SELECT COUNT(*) as srBoard FROM math_srijonshil WHERE chapter_id = ? AND source_type = 'board'`,
    [CHAPTER_ID]
  );
  const [[{ srGuide }]] = await db.execute(
    `SELECT COUNT(*) as srGuide FROM math_srijonshil WHERE chapter_id = ? AND source_type = 'guide_model'`,
    [CHAPTER_ID]
  );

  console.log('\n========================================');
  console.log('✅ সব data successfully insert হয়েছে!');
  console.log(`📝 Exercises with solution  : ${eWithSol}`);
  console.log(`📖 Srijonshil (Board)       : ${srBoard}`);
  console.log(`📖 Srijonshil (Guide/Model) : ${srGuide}`);
  console.log('========================================');

  await db.end();
}

seedGuideData().catch((err) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  process.exit(1);
=======
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'pathobondhu',
        charset: 'utf8mb4'
    });

    console.log('✅ Database connected!\n');

    const CHAPTER_ID = 3;

    function getSection(content, startMarker, endMarker) {
        const start = content.indexOf(startMarker);
        if (start === -1) return '';
        const from = start + startMarker.length;
        if (!endMarker) return content.slice(from);
        const end = content.indexOf(endMarker, from);
        return end === -1 ? content.slice(from) : content.slice(from, end);
    }

    // ================================================
    // PART 1: SOLUTIONS
    // ================================================
    console.log('📝 Solutions parse করছি...\n');

    const solutionsPath = path.join(__dirname, '../data/raw/ch3_solutions_MASTER.txt');
    const solutionsContent = fs.readFileSync(solutionsPath, 'utf8');

    const exerciseSections = [
        { exNum: '3.1', start: '=== EXERCISE 3.1 SOLUTIONS ===', end: '=== EXERCISE 3.2 SOLUTIONS ===' },
        { exNum: '3.2', start: '=== EXERCISE 3.2 SOLUTIONS ===', end: '=== EXERCISE 3.3 SOLUTIONS ===' },
        { exNum: '3.3', start: '=== EXERCISE 3.3 SOLUTIONS ===', end: '=== EXERCISE 3.4 SOLUTIONS ===' },
        { exNum: '3.4', start: '=== EXERCISE 3.4 SOLUTIONS ===', end: '=== EXERCISE 3.5 SOLUTIONS (Part 1) ===' },
        { exNum: '3.5', start: null, end: null }, // special handling
    ];

    for (const { exNum, start, end } of exerciseSections) {
        let sectionRaw = '';

        if (exNum === '3.5') {
            const part1 = getSection(solutionsContent, '=== EXERCISE 3.5 SOLUTIONS (Part 1) ===', '=== EXERCISE 3.5 SOLUTIONS (Part 2) ===');
            const part2 = getSection(solutionsContent, '=== EXERCISE 3.5 SOLUTIONS (Part 2) ===', '========================================');
            sectionRaw = part1 + '\n' + part2;
        } else {
            sectionRaw = getSection(solutionsContent, start, end);
        }

        if (!sectionRaw.trim()) {
            console.log(`  ⚠️  Exercise ${exNum} solutions পাওয়া যায়নি`);
            continue;
        }

        console.log(`  Exercise ${exNum} solutions processing...`);

        const lines = sectionRaw.split('\n');
        const solutionMap = {};
        let currentQNum = null;
        let currentBuffer = [];

        const flushBuffer = () => {
            if (currentQNum && currentBuffer.length > 0) {
                if (!solutionMap[currentQNum]) solutionMap[currentQNum] = '';
                solutionMap[currentQNum] += currentBuffer.join('\n') + '\n';
                currentBuffer = [];
            }
        };

        for (const line of lines) {
            const trimmed = line.trim();

            const solMatch = trimmed.match(/^Q(\d+)[A-Z]?_SOLUTION:\s*(.*)$/);
            if (solMatch) {
                const [, num, rest] = solMatch;
                if (num !== currentQNum) {
                    flushBuffer();
                    currentQNum = num;
                }
                if (rest.trim()) currentBuffer.push(rest.trim());
                continue;
            }

            const stepMatch = trimmed.match(/^(?:\(.*?\)\s*)?STEP_(\d+):\s*(.+)$/);
            if (stepMatch && currentQNum) {
                currentBuffer.push(`ধাপ ${stepMatch[1]}: ${stepMatch[2].trim()}`);
                continue;
            }

            const ansMatch = trimmed.match(/^FINAL_ANSWER:\s*(.+)$/);
            if (ansMatch && currentQNum) {
                currentBuffer.push(`উত্তর: ${ansMatch[1].trim()}`);
                continue;
            }
        }

        flushBuffer();

        for (const [qNum, solutionText] of Object.entries(solutionMap)) {
            const displayOrder = parseInt(qNum);

            const [rows] = await db.execute(
                `SELECT exercise_id FROM math_exercises 
         WHERE chapter_id = ? AND exercise_number = ? AND display_order = ?`,
                [CHAPTER_ID, exNum, displayOrder]
            );

            if (rows.length > 0) {
                await db.execute(
                    `UPDATE math_exercises SET solution_steps = ? WHERE exercise_id = ?`,
                    [solutionText.trim(), rows[0].exercise_id]
                );
                console.log(`    ✓ Exercise ${exNum} Q${qNum} updated`);
            } else {
                console.log(`    ⚠️  Exercise ${exNum} Q${qNum} not found in DB`);
            }
        }
    }

    // ================================================
    // PART 2: SRIJONSHIL
    // ================================================
    console.log('\n\n📖 Srijonshil parse করছি...');

    const srijonshilPath = path.join(__dirname, '../data/raw/ch3_srijonshil_MASTER.txt');
    const srijonshilContent = fs.readFileSync(srijonshilPath, 'utf8');

    // Exact markers from file
    const boardSection = getSection(srijonshilContent, '=== BOARD QUESTIONS ===', '=== GUIDE + MODEL TEST QUESTIONS ===');
    const guideSection = getSection(srijonshilContent, '=== GUIDE + MODEL TEST QUESTIONS ===', '========================================');

    async function parseSrijonshil(content, sourceType) {
        if (!content.trim()) {
            console.log(`  ⚠️  ${sourceType} section পাওয়া যায়নি`);
            return;
        }

        const lines = content.split('\n');
        const cqMap = {};
        let currentCQ = null;
        let currentField = null;
        let currentBuffer = [];

        const flushCQBuffer = () => {
            if (currentCQ && currentField && currentBuffer.length > 0) {
                if (!cqMap[currentCQ]) cqMap[currentCQ] = {};
                cqMap[currentCQ][currentField] = currentBuffer.join('\n').trim();
                currentBuffer = [];
            }
        };

        for (const line of lines) {
            const trimmed = line.trim();

            const fieldMatch = trimmed.match(/^CQ(\d+)_(SOURCE|UDDIPOK|Q_KA|Q_KHA|Q_GA|Q_GHA|ANS_KA|ANS_KHA|ANS_GA|ANS_GHA):\s*(.*)$/);
            if (fieldMatch) {
                const [, num, field, value] = fieldMatch;
                if (num !== currentCQ || field !== currentField) {
                    flushCQBuffer();
                    currentCQ = num;
                    currentField = field;
                }
                if (value.trim()) currentBuffer.push(value.trim());
                continue;
            }

            const stepMatch = trimmed.match(/^(?:\(.*?\)\s*)?STEP_(\d+):\s*(.+)$/);
            if (stepMatch && currentCQ && currentField && currentField.startsWith('ANS_')) {
                currentBuffer.push(`ধাপ ${stepMatch[1]}: ${stepMatch[2].trim()}`);
                continue;
            }

            const ansMatch = trimmed.match(/^FINAL_ANSWER:\s*(.+)$/);
            if (ansMatch && currentCQ && currentField) {
                currentBuffer.push(`উত্তর: ${ansMatch[1].trim()}`);
                continue;
            }
        }

        flushCQBuffer();

        const sortedCQIds = Object.keys(cqMap).sort((a, b) => parseInt(a) - parseInt(b));
        let order = 1;

        for (const cqId of sortedCQIds) {
            const cq = cqMap[cqId];
            if (!cq.Q_KA) continue;

            const source = cq.SOURCE || '';
            let boardId = null;
            if (source.includes('ঢাকা')) boardId = 1;
            else if (source.includes('চট্টগ্রাম')) boardId = 2;
            else if (source.includes('রাজশাহী')) boardId = 3;
            else if (source.includes('যশোর')) boardId = 4;
            else if (source.includes('কুমিল্লা')) boardId = 5;
            else if (source.includes('সিলেট')) boardId = 6;
            else if (source.includes('বরিশাল')) boardId = 7;
            else if (source.includes('দিনাজপুর')) boardId = 8;
            else if (source.includes('ময়মনসিংহ')) boardId = 9;

            const yearMatch = source.match(/(\d{4})/);
            const examYear = yearMatch ? parseInt(yearMatch[1]) : null;

            const parts = [
                { qField: 'Q_KA', ansField: 'ANS_KA', part: 'ক' },
                { qField: 'Q_KHA', ansField: 'ANS_KHA', part: 'খ' },
                { qField: 'Q_GA', ansField: 'ANS_GA', part: 'গ' },
                { qField: 'Q_GHA', ansField: 'ANS_GHA', part: 'ঘ' },
            ];

            for (const { qField, ansField, part } of parts) {
                if (!cq[qField]) continue;

                await db.execute(
                    `INSERT INTO math_srijonshil
           (chapter_id, category, uddipok_text, question_text, solution,
            board_id, exam_year, source_name, source_type, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        CHAPTER_ID,
                        part,
                        cq.UDDIPOK || '',
                        cq[qField],
                        cq[ansField] || '',
                        boardId,
                        examYear,
                        source,
                        sourceType === 'board' ? 'board' : 'guide_model',
                        order++
                    ]
                );
                console.log(`  ✓ CQ${cqId} (${part}) [${sourceType}] — ${source}`);
            }
        }
    }

    console.log('\n  📌 Board questions:');
    await parseSrijonshil(boardSection, 'board');

    console.log('\n  📌 Guide/Model test questions:');
    await parseSrijonshil(guideSection, 'guide');

    // ================================================
    // SUMMARY
    // ================================================
    const [[{ eWithSol }]] = await db.execute(
        `SELECT COUNT(*) as eWithSol FROM math_exercises 
     WHERE chapter_id = ? AND solution_steps IS NOT NULL AND solution_steps != ''`,
        [CHAPTER_ID]
    );
    const [[{ srBoard }]] = await db.execute(
        `SELECT COUNT(*) as srBoard FROM math_srijonshil WHERE chapter_id = ? AND source_type = 'board'`,
        [CHAPTER_ID]
    );
    const [[{ srGuide }]] = await db.execute(
        `SELECT COUNT(*) as srGuide FROM math_srijonshil WHERE chapter_id = ? AND source_type = 'guide_model'`,
        [CHAPTER_ID]
    );

    console.log('\n========================================');
    console.log('✅ সব data successfully insert হয়েছে!');
    console.log(`📝 Exercises with solution  : ${eWithSol}`);
    console.log(`📖 Srijonshil (Board)       : ${srBoard}`);
    console.log(`📖 Srijonshil (Guide/Model) : ${srGuide}`);
    console.log('========================================');

    await db.end();
}

seedGuideData().catch((err) => {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    process.exit(1);
>>>>>>> origin/main
});
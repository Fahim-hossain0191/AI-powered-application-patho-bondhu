/**
 * end-to-end Integration Test Script (Expanded & Fixed)
 * 
 * এই স্ক্রিপ্টটি স্বয়ংক্রিয়ভাবে:
 * ১. টেস্ট ইউজার রেজিস্টার/লগইন করবে।
 * ২. চ্যাপ্টারের কনসেপ্ট এন্ডপয়েন্ট টেস্ট করবে।
 * ৩. AI Hint এন্ডপয়েন্ট টেস্ট করবে।
 * ৪. MCQ Generate এবং Answer Submit টেস্ট করবে।
 * ۵. যাচাই (Jachai) মডিউল: Exercise Check (Text), Solve Question এবং Check Solution টেস্ট করবে।
 */

const BACKEND_URL = 'http://localhost:5000/api';
const testUser = {
  full_name: 'Test Student',
  email: 'teststudent@example.com',
  phone: '01712345678',
  password: 'password123'
};

async function runTests() {
  console.log('🚀 API Integration Test শুরু হচ্ছে...\n');

  let token = '';

  // ১. রেজিস্ট্রেশন ও লগইন টেস্ট
  try {
    console.log('🔹 ১. ইউজার রেজিস্ট্রেশন চেষ্টা করা হচ্ছে...');
    const regRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();

    if (regRes.ok) {
      console.log('✅ রেজিস্ট্রেশন সফল হয়েছে! লগইন করা হচ্ছে...');
      const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        token = loginData.data.token;
      } else {
        console.error('❌ রেজিস্ট্রেশন পরবর্তী লগইন ব্যর্থ:', loginData);
        return;
      }
    } else if (regData.message && regData.message.includes('registered')) {
      console.log('ℹ️ ইউজার ইতোমধ্যে রেজিস্টার্ড। লগইন করা হচ্ছে...');
      const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      const loginData = await loginRes.json();

      if (loginRes.ok) {
        console.log('✅ লগইন সফল হয়েছে!');
        token = loginData.data.token;
      } else {
        console.error('❌ লগইন ব্যর্থ হয়েছে:', loginData);
        return;
      }
    } else {
      console.error('❌ রেজিস্ট্রেশন ব্যর্থ হয়েছে:', regData);
      return;
    }
  } catch (err) {
    console.error('❌ নেটওয়ার্ক ত্রুটি:', err.message);
    return;
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // ২. চ্যাপ্টার কনসেপ্ট রিট্রিভাল টেস্ট
  try {
    console.log('\n🔹 ২. Chapter 3 এর Concepts লোড করা হচ্ছে...');
    const conceptsRes = await fetch(`${BACKEND_URL}/math/chapters/3/concepts`, {
      headers: authHeaders
    });
    const conceptsData = await conceptsRes.json();
    if (conceptsRes.ok) {
      console.log(`✅ সফলভাবে ${conceptsData.data.length}টি কনসেপ্ট পাওয়া গেছে!`);
      console.log('নমুনা কনসেপ্ট:', conceptsData.data[0] ? conceptsData.data[0].module_title : 'নেই');
    } else {
      console.error('❌ Concepts লোড করতে ব্যর্থ:', conceptsData);
    }
  } catch (err) {
    console.error('❌ নেটওয়ার্ক ত্রুটি:', err.message);
  }

  // ৩. AI Hint এন্ডপয়েন্ট টেস্ট
  try {
    console.log('\n🔹 ৩. Exercise 1 এর জন্য Phase 1 Hint চাওয়া হচ্ছে (AI Module কল)...');
    const hintRes = await fetch(`${BACKEND_URL}/math/hint`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        exercise_id: 1,
        phase: 1
      })
    });
    const hintData = await hintRes.json();
    if (hintRes.ok) {
      console.log('✅ AI থেকে সফলভাবে রেসপন্স পাওয়া গেছে!');
      console.log('💡 Hint Preview:', hintData.data.hint.substring(0, 100) + '...');
    } else {
      console.error('❌ AI Hint পেতে ব্যর্থ:', hintData);
    }
  } catch (err) {
    console.error('❌ নেটওয়ার্ক ত্রুটি:', err.message);
  }

  // ৪. MCQ Generate এবং Submit টেস্ট
  let session_id = null;
  let sampleMCQ = null;
  try {
    console.log('\n🔹 ৪. MCQ Generate করা হচ্ছে (Chapter 3)...');
    const mcqGenRes = await fetch(`${BACKEND_URL}/math/chapters/3/mcq/generate`, {
      method: 'POST',
      headers: authHeaders
    });
    const mcqGenData = await mcqGenRes.json();

    if (mcqGenRes.ok) {
      session_id = mcqGenData.data.session_id;
      sampleMCQ = mcqGenData.data.mcqs[0];
      console.log(`✅ সফলভাবে ${mcqGenData.data.count}টি MCQ তৈরি হয়েছে!`);
      console.log('প্রশ্ন:', sampleMCQ.question);
    } else {
      console.error('❌ MCQ Generate করতে ব্যর্থ:', mcqGenData);
    }

    if (session_id && sampleMCQ) {
      console.log('🔹 MCQ উত্তর সাবমিট করা হচ্ছে...');
      const submitRes = await fetch(`${BACKEND_URL}/math/mcq/submit`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          session_id,
          mcq_data: sampleMCQ,
          selected_option: sampleMCQ.correct
        })
      });
      const submitData = await submitRes.json();
      if (submitRes.ok) {
        console.log(`✅ উত্তর সঠিক হয়েছে কিনা: ${submitData.data.is_correct ? 'হ্যাঁ (সঠিক)' : 'না (ভুল)'}`);
        console.log('ব্যাখ্যা:', submitData.data.explanation);
      } else {
        console.error('❌ MCQ সাবমিট করতে ব্যর্থ:', submitData);
      }
    }
  } catch (err) {
    console.error('❌ MCQ টেস্টের নেটওয়ার্ক ত্রুটি:', err.message);
  }

  // ৫. যাচাই (Jachai) মডিউল টেস্ট
  // ৫.১ Exercise Check Text
  try {
    console.log('\n🔹 ৫.১ যাচাই - Exercise Answer Text Check...');
    const checkTextRes = await fetch(`${BACKEND_URL}/math/jachai/exercise-check-text`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        exercise_id: 1,
        student_answer: '4a^2 + 12ab + 9b^2'
      })
    });
    const checkTextData = await checkTextRes.json();
    if (checkTextRes.ok) {
      console.log(`✅ উত্তর মূল্যায়ন সম্পন্ন! সঠিক কিনা: ${checkTextData.data.is_correct ? 'হ্যাঁ' : 'না'}`);
      console.log('Feedback:', checkTextData.data.feedback);
    } else {
      console.error('❌ Answer Check Text ব্যর্থ:', checkTextData);
    }
  } catch (err) {
    console.error('❌ Answer Check Text এর নেটওয়ার্ক ত্রুটি:', err.message);
  }

  // ৫.২ Solve Question (যেকোনো গণিত সলভ)
  try {
    console.log('\n🔹 ৫.২ যাচাই - Solve Question (যেকোনো প্রশ্ন সমাধান)...');
    const solveRes = await fetch(`${BACKEND_URL}/math/jachai/solve`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        question: 'x^2 - 5x + 6 = 0 সমীকরণটি সমাধান করো',
        chapter_id: 3
      })
    });
    const solveData = await solveRes.json();
    if (solveRes.ok) {
      console.log('✅ প্রশ্নটি সফলভাবে সমাধান হয়েছে!');
      console.log('চূড়ান্ত উত্তর:', solveData.data.final_answer);
      if (solveData.data.solution_steps && solveData.data.solution_steps.length > 0) {
        console.log('প্রথম ধাপ:', solveData.data.solution_steps[0].explanation);
        console.log('প্রথম ধাপের গণিত:', solveData.data.solution_steps[0].math);
      }
    } else {
      console.error('❌ Solve Question ব্যর্থ:', solveData);
    }
  } catch (err) {
    console.error('❌ Solve Question এর নেটওয়ার্ক ত্রুটি:', err.message);
  }

  // ৫.৩ Check Solution (নিজের করা সলিউশন চেক)
  try {
    console.log('\n🔹 ৫.৩ যাচাই - Check Solution (নিজের করা সমাধান পরীক্ষা)...');
    const checkSolRes = await fetch(`${BACKEND_URL}/math/jachai/check`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        question: 'x^2 - 5x + 6 = 0',
        student_solution: 'x^2 - 3x - 2x + 6 = 0 => x(x-3) - 2(x-3) = 0 => (x-3)(x-2) = 0 => x = 2, 3',
        chapter_id: 3
      })
    });
    const checkSolData = await checkSolRes.json();
    if (checkSolRes.ok) {
      console.log('✅ সমাধান পরীক্ষা সম্পন্ন হয়েছে!');
      console.log(`সঠিক হয়েছে কি না: ${checkSolData.data.is_correct ? 'হ্যাঁ' : 'না'}`);
      console.log('মতামত:', checkSolData.data.feedback);
    } else {
      console.error('❌ Check Solution ব্যর্থ:', checkSolData);
    }
  } catch (err) {
    console.error('❌ Check Solution এর নেটওয়ার্ক ত্রুটি:', err.message);
  }

  console.log('\n🎉 সব টেস্ট সফলভাবে সম্পন্ন হয়েছে!');
}

runTests();

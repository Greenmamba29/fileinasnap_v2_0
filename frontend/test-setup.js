// Test script to validate FileInASnap setup
const { exec } = require('child_process');
const axios = require('axios');

async function testFrontend() {
  console.log('🧪 Testing Frontend...');
  
  try {
    // Test if React app is running
    const response = await axios.get('http://localhost:3000', { timeout: 5000 });
    if (response.status === 200) {
      console.log('✅ Frontend is running on port 3000');
      return true;
    }
  } catch (error) {
    console.log('❌ Frontend is not responding on port 3000');
    console.log('   Please run: npm start');
    return false;
  }
}

async function testBackend() {
  console.log('🧪 Testing Backend...');
  
  try {
    // Test if backend is running
    const response = await axios.get('http://localhost:8001/health', { timeout: 5000 });
    if (response.status === 200) {
      console.log('✅ Backend is running on port 8001');
      console.log(`   Status: ${response.data.status}`);
      return true;
    }
  } catch (error) {
    console.log('❌ Backend is not responding on port 8001');
    console.log('   Please run: cd ../backend && python3 main.py');
    return false;
  }
}

async function testSupabaseConfig() {
  console.log('🧪 Testing Supabase Configuration...');
  
  try {
    const fs = require('fs');
    const envContent = fs.readFileSync('.env', 'utf8');
    
    if (envContent.includes('REACT_APP_SUPABASE_URL') && 
        envContent.includes('REACT_APP_SUPABASE_ANON_KEY')) {
      console.log('✅ Frontend Supabase environment variables found');
    } else {
      console.log('❌ Missing Supabase environment variables in frontend .env');
      return false;
    }
    
    // Check backend env
    const backendEnvContent = fs.readFileSync('../backend/.env', 'utf8');
    if (backendEnvContent.includes('SUPABASE_URL') && 
        backendEnvContent.includes('SUPABASE_SERVICE_KEY')) {
      console.log('✅ Backend Supabase environment variables found');
      return true;
    } else {
      console.log('❌ Missing Supabase environment variables in backend .env');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error reading environment files');
    return false;
  }
}

async function runTests() {
  console.log('🚀 FileInASnap Setup Validation\n');
  
  const frontendOk = await testFrontend();
  const backendOk = await testBackend();
  const supabaseOk = await testSupabaseConfig();
  
  console.log('\n📊 Test Results:');
  console.log(`Frontend: ${frontendOk ? '✅' : '❌'}`);
  console.log(`Backend: ${backendOk ? '✅' : '❌'}`);
  console.log(`Supabase Config: ${supabaseOk ? '✅' : '❌'}`);
  
  if (frontendOk && backendOk && supabaseOk) {
    console.log('\n🎉 All systems are ready!');
    console.log('📝 Next steps:');
    console.log('1. Set up Supabase database schema (run the init_schema.sql)');
    console.log('2. Create a Supabase storage bucket named "user-files"');
    console.log('3. Test authentication and file upload');
    console.log('\n🌐 Access your app at: http://localhost:3000');
  } else {
    console.log('\n⚠️  Some issues need to be resolved before proceeding.');
  }
}

// Install axios if not present
try {
  require('axios');
  runTests();
} catch (error) {
  console.log('Installing axios for testing...');
  exec('npm install axios --save-dev', (err) => {
    if (err) {
      console.error('Failed to install axios. Please install manually: npm install axios --save-dev');
    } else {
      console.log('axios installed successfully');
      runTests();
    }
  });
}

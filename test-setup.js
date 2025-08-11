import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
const execAsync = util.promisify(exec);

console.log('🚀 FileInASnap Setup Validation (Steps 1-6)\n');

// Check if required files exist
function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
}

// Check environment variables in .env file
function checkEnvFile(envPath, requiredVars) {
  if (!fs.existsSync(envPath)) {
    console.log(`❌ Environment file not found: ${envPath}`);
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const missingVars = [];
  requiredVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`❌ Missing environment variables in ${envPath}:`);
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    return false;
  }
  
  console.log(`✅ All required environment variables found in ${envPath}`);
  return true;
}

// Test if servers can start
async function testServers() {
  console.log('\n📡 Testing server startup...\n');
  
  try {
    // Test frontend
    console.log('Testing frontend build...');
    const { stdout: frontendOutput } = await execAsync('cd frontend && npm run build', { timeout: 45000 });
    console.log('✅ Frontend builds successfully');
    
    // Test backend
    console.log('Testing backend dependencies...');
    const { stdout: backendOutput } = await execAsync('cd backend && python3 -c "import fastapi, supabase, uvicorn; print(\'All dependencies available\')"');
    console.log('✅ Backend dependencies available');
    
  } catch (error) {
    console.log(`❌ Server test failed: ${error.message}`);
    return false;
  }
  
  return true;
}

// Check deployment readiness
function checkDeploymentFiles() {
  console.log('\n🚀 Checking deployment configuration...\n');
  
  const deploymentChecks = [
    checkFile('./frontend/netlify.toml', 'Netlify config'),
    checkFile('./setup-database.sql', 'Enhanced database schema')
  ];
  
  // Check if netlify.toml has API redirect
  if (fs.existsSync('./frontend/netlify.toml')) {
    const netlifyConfig = fs.readFileSync('./frontend/netlify.toml', 'utf8');
    const hasApiRedirect = netlifyConfig.includes('/api/*');
    console.log(`${hasApiRedirect ? '✅' : '❌'} Netlify config has API redirect`);
    return deploymentChecks.every(check => check) && hasApiRedirect;
  }
  
  return deploymentChecks.every(check => check);
}

async function main() {
  let allChecksPass = true;
  
  console.log('📋 STEP 1-3: Core Setup Validation\n');
  
  // File structure checks
  console.log('📁 Checking file structure...');
  const fileChecks = [
    checkFile('./frontend/package.json', 'Frontend package.json'),
    checkFile('./frontend/src/App.js', 'Main App component'),
    checkFile('./frontend/src/contexts/AuthContext.tsx', 'Auth context'),
    checkFile('./frontend/src/pages/DashboardPage.js', 'Dashboard component'),
    checkFile('./frontend/src/components/upload/UploadModal.js', 'Upload modal component'),
    checkFile('./frontend/src/components/auth/ProtectedRoute.js', 'Protected route component'),
    checkFile('./backend/main.py', 'FastAPI main'),
    checkFile('./backend/requirements.txt', 'Backend requirements'),
    checkFile('./backend/init_schema.sql', 'Database schema')
  ];
  
  allChecksPass = fileChecks.every(check => check) && allChecksPass;
  
  // Environment checks
  console.log('\n🔧 Checking environment configuration...');
  
  // Frontend env vars
  const frontendEnvVars = [
    'REACT_APP_SUPABASE_URL',
    'REACT_APP_SUPABASE_ANON_KEY'
  ];
  
  // Backend env vars
  const backendEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY',
    'SUPABASE_JWT_SECRET'
  ];
  
  const envChecks = [
    checkEnvFile('./frontend/.env', frontendEnvVars),
    checkEnvFile('./backend/.env', backendEnvVars)
  ];
  
  allChecksPass = envChecks.every(check => check) && allChecksPass;
  
  console.log('\n📋 STEP 4: Upload Testing Components');
  const uploadChecks = [
    checkFile('./frontend/src/components/upload/UploadModal.js', 'Upload modal with drag & drop'),
    checkFile('./backend/main.py', 'FastAPI with upload endpoints')
  ];
  allChecksPass = uploadChecks.every(check => check) && allChecksPass;
  
  console.log('\n📋 STEP 5: Enhanced Database Schema');
  const step5Checks = [
    checkFile('./setup-database.sql', 'Enhanced schema with RLS policies')
  ];
  allChecksPass = step5Checks.every(check => check) && allChecksPass;
  
  console.log('\n📋 STEP 6: Deployment Configuration');
  const deploymentReady = checkDeploymentFiles();
  allChecksPass = deploymentReady && allChecksPass;
  
  // Server tests
  const serverCheck = await testServers();
  allChecksPass = serverCheck && allChecksPass;
  
  // Results
  console.log('\n' + '='.repeat(60));
  if (allChecksPass) {
    console.log('🎉 All validation checks passed! FileInASnap is ready for testing.');
    console.log('\n📋 NEXT STEPS TO COMPLETE:');
    console.log('\n1. 🗄️  DATABASE SETUP:');
    console.log('   • Copy setup-database.sql content into Supabase SQL editor and run it');
    console.log('   • Create "user-files" storage bucket in Supabase Storage dashboard (private)');
    console.log('\n2. 🚀 START SERVERS:');
    console.log('   • Frontend: cd frontend && npm start');
    console.log('   • Backend:  cd backend && uvicorn main:app --reload --port 8001');
    console.log('\n3. 🧪 TESTING FLOW:');
    console.log('   • Sign in with your Supabase account');
    console.log('   • Navigate to Dashboard');
    console.log('   • Test file upload with drag & drop');
    console.log('   • Verify files appear in dashboard');
    console.log('\n4. 🌐 DEPLOYMENT (Optional):');
    console.log('   • Update netlify.toml with your FastAPI host URL');
    console.log('   • Set environment variables in Netlify dashboard');
    console.log('   • Deploy to Netlify');
  } else {
    console.log('❌ Some validation checks failed. Please fix the issues above.');
  }
  console.log('='.repeat(60));
}

main().catch(console.error);

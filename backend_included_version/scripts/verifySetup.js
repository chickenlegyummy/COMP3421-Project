/**
 * Setup Verification Script
 * Checks if all required files and dependencies are properly set up
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 GuitarHub Backend - Setup Verification\n');
console.log('=' .repeat(50));

const checks = {
    passed: 0,
    failed: 0,
    warnings: 0
};

/**
 * Check if file exists
 */
function checkFile(filePath, description) {
    const exists = fs.existsSync(path.join(__dirname, '..', filePath));
    if (exists) {
        console.log(`✅ ${description}`);
        checks.passed++;
    } else {
        console.log(`❌ ${description} - MISSING`);
        checks.failed++;
    }
    return exists;
}

/**
 * Check directory
 */
function checkDirectory(dirPath, description) {
    const exists = fs.existsSync(path.join(__dirname, '..', dirPath));
    if (exists) {
        console.log(`✅ ${description}`);
        checks.passed++;
    } else {
        console.log(`❌ ${description} - MISSING`);
        checks.failed++;
    }
    return exists;
}

/**
 * Check environment variables
 */
function checkEnvFile() {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        console.log(`✅ Environment file (.env) exists`);
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        // Check for required variables
        const requiredVars = ['PORT', 'JWT_SECRET', 'DB_PATH'];
        let allVarsPresent = true;
        
        requiredVars.forEach(varName => {
            if (!envContent.includes(varName)) {
                console.log(`   ⚠️  Warning: ${varName} not found in .env`);
                checks.warnings++;
                allVarsPresent = false;
            }
        });
        
        if (allVarsPresent) {
            checks.passed++;
        } else {
            checks.failed++;
        }
    } else {
        console.log(`⚠️  Warning: .env file not found (will use defaults)`);
        checks.warnings++;
    }
}

/**
 * Check package.json dependencies
 */
function checkDependencies() {
    const packagePath = path.join(__dirname, '..', 'package.json');
    if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const requiredDeps = [
            'express',
            'sqlite3',
            'bcrypt',
            'jsonwebtoken',
            'cors',
            'dotenv',
            'express-validator'
        ];
        
        let allDepsPresent = true;
        requiredDeps.forEach(dep => {
            if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
                console.log(`   ❌ Missing dependency: ${dep}`);
                checks.failed++;
                allDepsPresent = false;
            }
        });
        
        if (allDepsPresent) {
            console.log(`✅ All required dependencies in package.json`);
            checks.passed++;
        }
    } else {
        console.log(`❌ package.json not found`);
        checks.failed++;
    }
}

/**
 * Check node_modules
 */
function checkNodeModules() {
    const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
        console.log(`✅ node_modules directory exists`);
        checks.passed++;
    } else {
        console.log(`⚠️  Warning: node_modules not found - run 'npm install'`);
        checks.warnings++;
    }
}

// Run all checks
console.log('\n📂 Core Files:');
console.log('-'.repeat(50));
checkFile('server.js', 'Main server file');
checkFile('database.js', 'Database configuration');
checkFile('package.json', 'Package configuration');
checkFile('.env.example', 'Environment example file');

console.log('\n📁 Directories:');
console.log('-'.repeat(50));
checkDirectory('routes', 'Routes directory');
checkDirectory('middleware', 'Middleware directory');
checkDirectory('scripts', 'Scripts directory');
checkDirectory('js', 'Frontend JavaScript directory');
checkDirectory('css', 'Stylesheets directory');
checkDirectory('pages', 'HTML pages directory');

console.log('\n🔐 Route Files:');
console.log('-'.repeat(50));
checkFile('routes/auth.js', 'Authentication routes');
checkFile('routes/products.js', 'Products routes');
checkFile('routes/accessories.js', 'Accessories routes');
checkFile('routes/cart.js', 'Cart routes');
checkFile('routes/orders.js', 'Orders routes');
checkFile('routes/reviews.js', 'Reviews routes');

console.log('\n🛡️  Middleware:');
console.log('-'.repeat(50));
checkFile('middleware/auth.js', 'Authentication middleware');

console.log('\n📜 Scripts:');
console.log('-'.repeat(50));
checkFile('scripts/initDatabase.js', 'Database initialization script');

console.log('\n⚙️  Frontend Integration:');
console.log('-'.repeat(50));
checkFile('js/api-config.js', 'API configuration');
checkFile('js/cart.js', 'Cart manager');
checkFile('js/auth.js', 'Authentication handler');

console.log('\n🌐 HTML Pages:');
console.log('-'.repeat(50));
checkFile('index.html', 'Homepage');
checkFile('pages/login.html', 'Login page');
checkFile('pages/register.html', 'Register page');
checkFile('pages/products.html', 'Products page');
checkFile('pages/cart.html', 'Cart page');

console.log('\n📚 Documentation:');
console.log('-'.repeat(50));
checkFile('README.md', 'Main README');
checkFile('QUICKSTART.md', 'Quick start guide');
checkFile('API_DOCUMENTATION.md', 'API documentation');

console.log('\n⚙️  Configuration:');
console.log('-'.repeat(50));
checkEnvFile();
checkDependencies();
checkNodeModules();

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed: ${checks.passed}`);
console.log(`❌ Failed: ${checks.failed}`);
console.log(`⚠️  Warnings: ${checks.warnings}`);

if (checks.failed === 0) {
    console.log('\n✨ All checks passed! Your setup is complete.');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure node_modules is installed: npm install');
    console.log('   2. Initialize the database: npm run init-db');
    console.log('   3. Start the server: npm start');
    console.log('   4. Visit http://localhost:3000\n');
    process.exit(0);
} else {
    console.log('\n⚠️  Some checks failed. Please fix the issues above.');
    console.log('   Run this script again after fixing.\n');
    process.exit(1);
}

#!/usr/bin/env node

/**
 * SCORM Package Builder
 *
 * This script creates a SCORM 1.2 compliant ZIP package from your learning object.
 *
 * Usage:
 *   node scripts/build-scorm.js [source-folder]
 *
 * Example:
 *   node scripts/build-scorm.js example-module
 *
 * If no source folder specified, will prompt for one.
 */

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const readline = require('readline');

// Configuration
const DIST_DIR = path.join(__dirname, '..', 'dist');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

// ANSI colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
};

// Helper functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
    log(`❌ ERROR: ${message}`, 'red');
}

function success(message) {
    log(`✅ ${message}`, 'green');
}

function info(message) {
    log(`ℹ️  ${message}`, 'blue');
}

function warning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

// Get user input
function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

// Generate imsmanifest.xml
function generateManifest(config) {
    const now = new Date().toISOString();

    const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${config.identifier}" version="1.0"
    xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
    xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                        http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                        http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">

    <metadata>
        <schema>ADL SCORM</schema>
        <schemaversion>1.2</schemaversion>
        <lom xmlns="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1">
            <general>
                <title>
                    <langstring xml:lang="en">${escapeXml(config.title)}</langstring>
                </title>
                <description>
                    <langstring xml:lang="en">${escapeXml(config.description)}</langstring>
                </description>
                <keyword>
                    <langstring xml:lang="en">interactive learning</langstring>
                </keyword>
            </general>
            <lifeCycle>
                <version>
                    <langstring xml:lang="en">${config.version}</langstring>
                </version>
                <contribute>
                    <role>
                        <source>
                            <langstring xml:lang="en">LOMv1.0</langstring>
                        </source>
                        <value>
                            <langstring xml:lang="en">Author</langstring>
                        </value>
                    </role>
                    <date>
                        <dateTime>${now}</dateTime>
                    </date>
                </contribute>
            </lifeCycle>
            <technical>
                <format>text/html</format>
            </technical>
        </lom>
    </metadata>

    <organizations default="ORG-${config.identifier}">
        <organization identifier="ORG-${config.identifier}">
            <title>${escapeXml(config.title)}</title>
            <item identifier="ITEM-${config.identifier}" identifierref="RES-${config.identifier}">
                <title>${escapeXml(config.title)}</title>
                <adlcp:masteryscore>${config.masteryScore || 80}</adlcp:masteryscore>
            </item>
        </organization>
    </organizations>

    <resources>
        <resource identifier="RES-${config.identifier}" type="webcontent" adlcp:scormtype="sco" href="${config.launchFile}">
${generateFileList(config.files, config.launchFile)}
        </resource>
    </resources>
</manifest>`;

    return manifest;
}

// Helper to escape XML special characters
function escapeXml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Generate file list for manifest
function generateFileList(files, launchFile) {
    return files
        .map(file => `            <file href="${file}"/>`)
        .join('\n');
}

// Recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        } else {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}

// Get relative path from base
function getRelativePath(filePath, basePath) {
    return path.relative(basePath, filePath).replace(/\\/g, '/');
}

// Validate source directory
function validateSource(sourcePath) {
    if (!fs.existsSync(sourcePath)) {
        error(`Source directory not found: ${sourcePath}`);
        return false;
    }

    const launchFile = path.join(sourcePath, 'index.html');
    if (!fs.existsSync(launchFile)) {
        error('Launch file (index.html) not found in source directory');
        info('Your module must have an index.html file as the entry point');
        return false;
    }

    return true;
}

// Create SCORM package
async function buildPackage(sourcePath, config) {
    log('\n📦 Building SCORM Package...', 'cyan');

    // Ensure dist directory exists
    await fs.ensureDir(DIST_DIR);

    // Create temporary build directory
    const tempDir = path.join(__dirname, '..', '.temp-build');
    await fs.ensureDir(tempDir);

    try {
        // Copy source files to temp directory
        info('Copying source files...');
        await fs.copy(sourcePath, tempDir);

        // Get all files
        const allFiles = getAllFiles(tempDir);
        const relativeFiles = allFiles.map(f => getRelativePath(f, tempDir));

        // Generate manifest
        info('Generating imsmanifest.xml...');
        const manifestConfig = {
            identifier: config.identifier || `MANIFEST-${Date.now()}`,
            title: config.title,
            description: config.description,
            version: config.version || '1.0',
            launchFile: 'index.html',
            masteryScore: config.masteryScore || 80,
            files: relativeFiles
        };

        const manifest = generateManifest(manifestConfig);
        await fs.writeFile(path.join(tempDir, 'imsmanifest.xml'), manifest);

        // Create ZIP file
        const outputFile = path.join(DIST_DIR, `${config.outputName}.zip`);
        info(`Creating ZIP file: ${config.outputName}.zip`);

        await createZip(tempDir, outputFile);

        // Clean up temp directory
        await fs.remove(tempDir);

        // Get file size
        const stats = fs.statSync(outputFile);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

        success(`\nSCORM package created successfully!`);
        log(`\n📄 Package Details:`, 'cyan');
        log(`   Name: ${config.outputName}.zip`);
        log(`   Size: ${fileSizeMB} MB`);
        log(`   Location: ${outputFile}`);
        log(`   Files: ${relativeFiles.length + 1} (including manifest)`);

        if (stats.size > 50 * 1024 * 1024) {
            warning(`\n⚠️  Package is large (${fileSizeMB} MB). Consider optimizing images and assets.`);
        }

        log(`\n🚀 Next Steps:`, 'cyan');
        log(`   1. Test in SCORM Cloud: https://cloud.scorm.com`);
        log(`   2. Upload to LMS staging environment`);
        log(`   3. Follow testing/test-checklist.md`);

    } catch (err) {
        await fs.remove(tempDir);
        throw err;
    }
}

// Create ZIP archive
function createZip(sourceDir, outputFile) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputFile);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        output.on('close', () => {
            resolve();
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);

        // Add all files from source directory
        archive.directory(sourceDir, false);

        archive.finalize();
    });
}

// Interactive mode - prompt for configuration
async function interactiveMode(sourcePath) {
    log('\n📝 SCORM Package Configuration', 'cyan');
    log('   (Press Enter to use default values)\n');

    const moduleName = path.basename(sourcePath);
    const title = await prompt(`Module Title [${moduleName}]: `) || moduleName;
    const description = await prompt('Description: ') || 'Interactive learning module';
    const version = await prompt('Version [1.0]: ') || '1.0';
    const outputName = await prompt(`Output filename [${moduleName}]: `) || moduleName;

    return {
        title,
        description,
        version,
        outputName,
        identifier: `MANIFEST-${outputName.replace(/[^a-zA-Z0-9]/g, '-')}`
    };
}

// Main function
async function main() {
    log('\n╔════════════════════════════════════════╗', 'cyan');
    log('║   SCORM 1.2 Package Builder v1.0      ║', 'cyan');
    log('╚════════════════════════════════════════╝\n', 'cyan');

    // Get source directory from command line or prompt
    let sourcePath = process.argv[2];

    if (!sourcePath) {
        log('Usage: node build-scorm.js [source-folder]\n', 'yellow');
        sourcePath = await prompt('Enter source folder path (e.g., example-module): ');

        if (!sourcePath) {
            error('No source folder specified');
            process.exit(1);
        }
    }

    // Resolve full path
    sourcePath = path.resolve(sourcePath);

    // Validate source
    if (!validateSource(sourcePath)) {
        process.exit(1);
    }

    info(`Source: ${sourcePath}`);

    // Get configuration
    const config = await interactiveMode(sourcePath);

    // Build package
    try {
        await buildPackage(sourcePath, config);
        success('\n✨ Build complete!');
    } catch (err) {
        error(`Build failed: ${err.message}`);
        console.error(err);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(err => {
        error(`Fatal error: ${err.message}`);
        console.error(err);
        process.exit(1);
    });
}

module.exports = { buildPackage, generateManifest };

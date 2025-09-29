#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Version update script for easyJSON project
 * Updates version in package.json, tauri config files, and Cargo.toml
 */

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateVersion(version) {
  // Basic semantic versioning validation
  const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
  return semverRegex.test(version);
}

function updatePackageJson(version) {
  const filePath = 'package.json';
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const packageJson = JSON.parse(content);
    const oldVersion = packageJson.version;
    packageJson.version = version;

    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
    log(`✓ Updated ${filePath}: ${oldVersion} → ${version}`, 'green');
    return true;
  } catch (error) {
    log(`✗ Failed to update ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function updateTauriConfig(filePath, version) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(content);
    const oldVersion = config.version;
    config.version = version;

    fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n');
    log(`✓ Updated ${filePath}: ${oldVersion} → ${version}`, 'green');
    return true;
  } catch (error) {
    log(`✗ Failed to update ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function updateCargoToml(version) {
  const filePath = 'src-tauri/Cargo.toml';
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const oldVersionMatch = content.match(/^version = "([^"]+)"/m);
    const oldVersion = oldVersionMatch ? oldVersionMatch[1] : 'unknown';

    content = content.replace(/^version = "[^"]+"/m, `version = "${version}"`);

    fs.writeFileSync(filePath, content);
    log(`✓ Updated ${filePath}: ${oldVersion} → ${version}`, 'green');
    return true;
  } catch (error) {
    log(`✗ Failed to update ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function getCurrentVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
  } catch (error) {
    return 'unknown';
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    log('Usage: node update-version.js <new-version>', 'yellow');
    log('Example: node update-version.js 1.0.0', 'cyan');
    log('Example: node update-version.js 1.0.0-beta.1', 'cyan');
    process.exit(1);
  }

  const newVersion = args[0];
  const currentVersion = getCurrentVersion();

  log(`\n${colors.bright}Version Update Script${colors.reset}`);
  log(`Current version: ${colors.cyan}${currentVersion}${colors.reset}`);
  log(`New version: ${colors.cyan}${newVersion}${colors.reset}\n`);

  if (!validateVersion(newVersion)) {
    log('✗ Invalid version format. Please use semantic versioning (e.g., 1.0.0, 1.0.0-beta.1)', 'red');
    process.exit(1);
  }

  if (newVersion === currentVersion) {
    log('⚠ Version is already set to this value', 'yellow');
    process.exit(0);
  }

  log('Updating files...\n');

  const files = [
    { name: 'package.json', update: () => updatePackageJson(newVersion) },
    { name: 'src-tauri/tauri.conf.json', update: () => updateTauriConfig('src-tauri/tauri.conf.json', newVersion) },
    { name: 'src-tauri/tauri.conf.dev.json', update: () => updateTauriConfig('src-tauri/tauri.conf.dev.json', newVersion) },
    { name: 'src-tauri/Cargo.toml', update: () => updateCargoToml(newVersion) }
  ];

  let successCount = 0;

  for (const file of files) {
    if (file.update()) {
      successCount++;
    }
  }

  log(`\n${colors.bright}Summary:${colors.reset}`);
  log(`✓ Successfully updated ${successCount}/${files.length} files`, successCount === files.length ? 'green' : 'yellow');

  if (successCount === files.length) {
    log('\n🎉 All files updated successfully!', 'green');
    log('You can now commit your changes:', 'cyan');
    log('  git add .', 'cyan');
    log(`  git commit -m "chore: bump version to ${newVersion}"`, 'cyan');
  } else {
    log('\n⚠ Some files failed to update. Please check the errors above.', 'yellow');
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`\n✗ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});

// Run the script
main();

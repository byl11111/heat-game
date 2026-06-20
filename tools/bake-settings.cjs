const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const input = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'baked-settings.js');
const output = path.join(root, 'baked-settings.js');

function readSettings(file) {
  const text = fs.readFileSync(file, 'utf8').trim();
  const jsMatch = text.match(/window\.HEAT_GAME_BAKED_SETTINGS\s*=\s*([\s\S]*?);?\s*$/);
  const json = jsMatch ? jsMatch[1] : text;
  return JSON.parse(json);
}

function normalize(settings) {
  return {
    tutorialTexts: settings.tutorialTexts || {},
    tutorialFlow: settings.tutorialFlow || null,
    tutorialOrganLabels: settings.tutorialOrganLabels || {},
    tutorialOrganLabelPositions: settings.tutorialOrganLabelPositions || {},
    settlementPlayer: settings.settlementPlayer || null,
    archiveImages: settings.archiveImages || {},
    caseLayout: settings.caseLayout || {},
    caseFrames: settings.caseFrames || {}
  };
}

const settings = normalize(readSettings(input));
fs.writeFileSync(output, `window.HEAT_GAME_BAKED_SETTINGS = ${JSON.stringify(settings, null, 2)};\n`, 'utf8');
console.log(`Wrote ${output}`);
console.log({
  tutorialTexts: Object.keys(settings.tutorialTexts).length,
  tutorialFlowEntries: settings.tutorialFlow && Array.isArray(settings.tutorialFlow.entries) ? settings.tutorialFlow.entries.length : 0,
  tutorialOrganLabels: Object.keys(settings.tutorialOrganLabels).length,
  tutorialOrganLabelPositions: Object.keys(settings.tutorialOrganLabelPositions).length,
  archiveImages: Object.keys(settings.archiveImages).length,
  caseLayout: Object.keys(settings.caseLayout).length,
  caseFrames: Object.keys(settings.caseFrames).length
});

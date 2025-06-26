import { setupGlobalGraphStyle } from "@/lib/graph/layout";
import { init as dbInit } from "@/lib/db/config";
import * as Comlink from "comlink";
import { compareText, compareTree } from "./command/compare";
import { csv2json, json2csv } from "./command/csv";
import { escape, unescape } from "./command/escape";
import { parseAndFormat } from "./command/parse";
import {
  clearGraphNodeSelected,
  computeGraphRevealPosition,
  createGraph,
  createTable,
  searchInView,
  setGraphSize,
  setGraphViewport,
  toggleGraphNodeHidden,
  toggleGraphNodeSelected,
  triggerGraphFoldSiblings,
} from "./stores/viewStore";

const worker = {
  parseAndFormat,
  compareText,
  compareTree,
  escape,
  unescape,
  csv2json,
  json2csv,
  setupGlobalGraphStyle,
  createTable,
  createGraph,
  setGraphSize,
  setGraphViewport,
  toggleGraphNodeHidden,
  toggleGraphNodeSelected,
  clearGraphNodeSelected,
  triggerGraphFoldSiblings,
  computeGraphRevealPosition,
  searchInView,
};

export type MyWorker = typeof worker;

dbInit();
Comlink.expose(worker);

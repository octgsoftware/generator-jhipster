/**
 * Copyright 2013-2022 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { platform } from 'os';
import generatorUtils from '../utils.cjs';

const { normalizeLineEndings } = generatorUtils;

const isWin32 = platform() === 'win32';

/**
 * Converts multiples EditFileCallback callbacks into one.
 *
 * @param {...import('./index.cjs').EditFileCallback} callbacks
 * @returns {import('./index.cjs').EditFileCallback}
 */
export const joinCallbacks = (...callbacks) => {
  return function (content, filePath) {
    if (isWin32 && content.match(/\r\n/)) {
      callbacks = [ct => normalizeLineEndings(ct, '\n')].concat(callbacks).concat(ct => normalizeLineEndings(ct, '\r\n'));
    }
    for (const callback of callbacks) {
      content = callback.call(this, content, filePath);
    }
    return content;
  };
};

export function formatDateForChangelog(now) {
  const nowUTC = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );
  const year = `${nowUTC.getFullYear()}`;

  let month = `${nowUTC.getMonth() + 1}`;
  if (month.length === 1) {
    month = `0${month}`;
  }

  let day = `${nowUTC.getDate()}`;
  if (day.length === 1) {
    day = `0${day}`;
  }

  let hour = `${nowUTC.getHours()}`;
  if (hour.length === 1) {
    hour = `0${hour}`;
  }

  let minute = `${nowUTC.getMinutes()}`;
  if (minute.length === 1) {
    minute = `0${minute}`;
  }

  let second = `${nowUTC.getSeconds()}`;
  if (second.length === 1) {
    second = `0${second}`;
  }

  return `${year}${month}${day}${hour}${minute}${second}`;
}

export function parseChangelog(changelogDate) {
  if (!changelogDate || changelogDate.length !== 14) {
    throw new Error(`${changelogDate} is not a valid changelogDate.`);
  }
  const formattedDate = `${changelogDate.substring(0, 4)}-${changelogDate.substring(4, 6)}-${changelogDate.substring(
    6,
    8
  )}T${changelogDate.substring(8, 10)}:${changelogDate.substring(10, 12)}:${changelogDate.substring(12, 14)}+00:00`;
  return new Date(Date.parse(formattedDate));
}

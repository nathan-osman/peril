/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2023 Nathan Osman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

#ifndef FILE_H
#define FILE_H

#include <QList>
#include <QString>

struct Clue
{
    QString answer;
    QString questions;
    bool used;
};

struct Category
{
    QString name;
    QList<Clue> clues;
};

struct Round
{
    QList<Category> categories;
};

struct File
{
    Round round_1;
    Round round_2;
    Round round_3;
};

/**
 * @brief Load a game file from disk
 * @param filename path to the JSON file
 * @param file reference to the file that will be loaded
 * @param error reference to error string
 * @return true if the file was loaded successfully
 */
bool loadFile(const QString &filename, File &file, QString &error);

#endif // FILE_H

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

#include <QFile>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonParseError>

#include "file.h"

QString readString(const QJsonObject &object, const QString &name)
{
    if (!object.contains(name)) {
        throw QString("$1 is missing").arg(name);
    }

    auto value = object[name];
    if (!value.isString()) {
        throw QString("$1 is not a string").arg(name);
    }

    return value.toString();
}

QList<QJsonObject> readArrayOfObjects(const QJsonObject &object, const QString &name)
{
    if(!object.contains(name)) {
        throw QString("$1 is missing").arg(name);
    }

    auto value = object[name];
    if (!value.isArray()) {
        throw QString("$1 is not an array").arg(name);
    }

    QList<QJsonObject> list;
    foreach (auto i, value.toArray()) {
        if (!i.isObject()) {
            throw QString("$1 is not an array of objects").arg(name);
        }
        list.append(i.toObject());
    }

    return list;
}

QJsonObject readObject(const QJsonObject &object, const QString &name)
{
    if (!object.contains(name)) {
        throw QString("$1 is missing").arg(name);
    }

    auto value = object[name];
    if (!value.isObject()) {
        throw QString("$1 is not an object").arg(name);
    }

    return value.toObject();
}

Clue readClue(const QJsonObject &object)
{
    Clue clue = {};
    clue.answer = readString(object, "answer");
    clue.questions = readString(object, "questions");
    return clue;
}

Category readCategory(const QJsonObject &object)
{
    Category category = {};
    category.name = readString(object, "name");
    foreach (auto i, readArrayOfObjects(object, "clues")) {
        category.clues.append(readClue(i));
    }
    return category;
}

Round readRound(const QJsonObject &object)
{
    Round round = {};
    foreach (auto i, readArrayOfObjects(object, "categories")) {
        round.categories.append(readCategory(i));
    }
    return round;
}

bool loadFile(const QString &filename, File &file, QString &error)
{
    QFile f(filename);
    if (!f.open(QIODevice::ReadOnly)) {
        error = f.errorString();
        return false;
    }

    QJsonParseError jsonError;
    QJsonDocument document = QJsonDocument::fromJson(f.readAll(), &jsonError);
    if (jsonError.error != QJsonParseError::NoError) {
        error = jsonError.errorString();
        return false;
    }
    if (!document.isObject()) {
        error = QString("document root must be an object");
        return false;
    }

    QJsonObject object = document.object();

    try {
        file.round_1 = readRound(readObject(object, "round_1"));
        file.round_2 = readRound(readObject(object, "round_2"));
        file.round_3 = readRound(readObject(object, "round_3"));
    } catch (const QString &message) {
        error = message;
        return false;
    }

    return true;
}

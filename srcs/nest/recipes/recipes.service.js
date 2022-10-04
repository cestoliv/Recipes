"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.RecipesService = void 0;
var common_1 = require("@nestjs/common");
var marmiton_api_1 = require("marmiton-api");
var RecipesParser = require('marmiton-api/dist/lib/components/recipes-parser').RecipesParser;
var node_html_parser_1 = require("node-html-parser");
var RecipesService = /** @class */ (function () {
    function RecipesService() {
    }
    RecipesService.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var URL, request, htmlBody, parsed, dom, name, rateRegex, rate, recipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        URL = "https://www.marmiton.org/recettes/recette_".concat(id, ".aspx");
                        return [4 /*yield*/, fetch(URL)];
                    case 1:
                        request = _a.sent();
                        if (request.status == 404)
                            throw new common_1.HttpException('Recipe not found', 404);
                        if (request.status !== 200)
                            throw new common_1.HttpException("Unknow error while fetching Marmiton's data", 500);
                        return [4 /*yield*/, request.text()];
                    case 2:
                        htmlBody = _a.sent();
                        return [4 /*yield*/, RecipesParser.parseRecipe(htmlBody)];
                    case 3:
                        parsed = _a.sent();
                        if (!parsed)
                            throw new common_1.HttpException("Unknow error while parsing Marmiton's data", 500);
                        dom = (0, node_html_parser_1.parse)(htmlBody);
                        name = dom.querySelectorAll('h1')[0].text;
                        if (!name)
                            throw new common_1.HttpException("Can't find recipe's name", 500);
                        rateRegex = htmlBody.match(/>(\d|\d\.\d)<!-- -->\/<!-- -->5/);
                        if (!rateRegex || !rateRegex[1])
                            throw new common_1.HttpException("Can't find recipe's rate", 500);
                        rate = Number(rateRegex[1]);
                        recipe = {
                            name: name,
                            rate: rate,
                            url: URL,
                            id: id,
                            ingredients: parsed.ingredients || [],
                            author: parsed.author || '',
                            images: parsed.images || [],
                            steps: parsed.steps || [],
                            description: parsed.description || '',
                            difficulty: parsed.difficulty || 0,
                            budget: parsed.budget || 0,
                            tags: parsed.tags || [],
                            prepTime: parsed.prepTime || 0,
                            totalTime: parsed.totalTime || 0,
                            people: parsed.people || 0
                        };
                        return [2 /*return*/, recipe];
                }
            });
        });
    };
    RecipesService.prototype.search = function (query, vegan, vegetarian, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var recipes, qb, q, result, _i, result_1, recipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipes = [];
                        qb = new marmiton_api_1.MarmitonQueryBuilder();
                        q = qb.withTitleContaining(query);
                        if (vegan)
                            q.vegan();
                        else if (vegetarian)
                            q.vegetarian();
                        if (!limit)
                            limit = 12;
                        return [4 /*yield*/, (0, marmiton_api_1.searchRecipes)(q.build(), { limit: limit })];
                    case 1:
                        result = _a.sent();
                        for (_i = 0, result_1 = result; _i < result_1.length; _i++) {
                            recipe = result_1[_i];
                            if (recipe.url.startsWith('https://www.marmiton.org/recettes/recette_'))
                                recipes.push(__assign({ id: recipe.url.split('recette_')[1].split('.aspx')[0] }, recipe));
                        }
                        if (recipes.length != 0)
                            recipes.sort(function (a, b) { return b.rate - a.rate; });
                        return [2 /*return*/, recipes];
                }
            });
        });
    };
    RecipesService = __decorate([
        (0, common_1.Injectable)()
    ], RecipesService);
    return RecipesService;
}());
exports.RecipesService = RecipesService;

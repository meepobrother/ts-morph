﻿import {expect} from "chai";
import {ParameteredNode, FunctionDeclaration, ParameterDeclaration} from "./../../../compiler";
import {ParameterDeclarationStructure, ParameteredNodeStructure} from "./../../../structures";
import {getInfoFromText} from "./../testHelpers";

describe(nameof(ParameteredNode), () => {
    describe(nameof<ParameteredNode>(d => d.getParameter), () => {
        const {firstChild} = getInfoFromText<FunctionDeclaration>("function func(param1: string, param2: number){}");

        it("should get the parameter by name", () => {
            expect(firstChild.getParameter("param1")!.getName()).to.equal("param1");
        });

        it("should get the parameter by function", () => {
            expect(firstChild.getParameter(p => p.getName() === "param2")).to.equal(firstChild.getParameters()[1]);
        });

        it("should return undefined when it doesn't exist", () => {
            expect(firstChild.getParameter("paramx")).to.be.undefined;
        });
    });

    describe(nameof<ParameteredNode>(d => d.getParameterOrThrow), () => {
        const {firstChild} = getInfoFromText<FunctionDeclaration>("function func(param1: string, param2: number){}");

        it("should get the parameter by name", () => {
            expect(firstChild.getParameterOrThrow("param1").getName()).to.equal("param1");
        });

        it("should get the parameter by function", () => {
            expect(firstChild.getParameterOrThrow(p => p.getName() === "param2")).to.equal(firstChild.getParameters()[1]);
        });

        it("should throw when it doesn't exist", () => {
            expect(() => firstChild.getParameterOrThrow("paramx")).to.throw();
        });
    });

    describe(nameof<ParameteredNode>(d => d.getParameters), () => {
        const {firstChild} = getInfoFromText<FunctionDeclaration>("function func(param1: string, param2: number){}");
        const parameters = firstChild.getParameters();

        it("should get the right number of parameters", () => {
            expect(parameters.length).to.equal(2);
        });

        it("should have parameter of type ParameterDeclaration", () => {
            expect(parameters[0]).to.be.instanceOf(ParameterDeclaration);
        });
    });

    describe(nameof<ParameteredNode>(n => n.addParameter), () => {
        function doTest(startCode: string, structure: ParameterDeclarationStructure, expectedCode: string) {
            const {firstChild} = getInfoFromText<FunctionDeclaration>(startCode);
            const result = firstChild.addParameter(structure);
            expect(firstChild.getText()).to.equal(expectedCode);
            expect(result).to.be.instanceof(ParameterDeclaration);
        }

        it("should add when none exists", () => {
            doTest("function identifier() {}", { name: "param" }, "function identifier(param) {}");
        });

        it("should add when one exists", () => {
            doTest("function identifier(param1) {}", { name: "param2" }, "function identifier(param1, param2) {}");
        });
    });

    describe(nameof<ParameteredNode>(n => n.addParameters), () => {
        function doTest(startCode: string, structures: ParameterDeclarationStructure[], expectedCode: string) {
            const {firstChild} = getInfoFromText<FunctionDeclaration>(startCode);
            const result = firstChild.addParameters(structures);
            expect(firstChild.getText()).to.equal(expectedCode);
            expect(result.length).to.equal(structures.length);
        }

        it("should add multiple", () => {
            doTest("function identifier(param1) {}", [{ name: "param2" }, { name: "param3" }], "function identifier(param1, param2, param3) {}");
        });
    });

    describe(nameof<ParameteredNode>(n => n.insertParameter), () => {
        function doTest(startCode: string, index: number, structure: ParameterDeclarationStructure, expectedCode: string) {
            const {firstChild} = getInfoFromText<FunctionDeclaration>(startCode);
            const result = firstChild.insertParameter(index, structure);
            expect(firstChild.getText()).to.equal(expectedCode);
            expect(result).to.be.instanceof(ParameterDeclaration);
        }

        it("should insert when none exists", () => {
            doTest("function identifier() {}", 0, { name: "param" }, "function identifier(param) {}");
        });

        it("should insert when one exists", () => {
            doTest("function identifier(param2) {}", 0, { name: "param1" }, "function identifier(param1, param2) {}");
        });
    });

    describe(nameof<ParameteredNode>(n => n.insertParameters), () => {
        function doTest(startCode: string, insertIndex: number, structures: ParameterDeclarationStructure[], expectedCode: string) {
            const {firstChild} = getInfoFromText<FunctionDeclaration>(startCode);
            const result = firstChild.insertParameters(insertIndex, structures);
            expect(firstChild.getText()).to.equal(expectedCode);
            expect(result.length).to.equal(structures.length);
        }

        it("should insert when none exists", () => {
            doTest("function identifier() {}", 0, [{ name: "param1", isReadonly: true }, { name: "param2", type: "string[]", isRestParameter: true }],
                "function identifier(readonly param1, ...param2: string[]) {}");
        });

        it("should insert at the start", () => {
            doTest("function identifier(param2) {}", 0, [{ name: "param1" }], "function identifier(param1, param2) {}");
        });

        it("should insert at the end", () => {
            doTest("function identifier(param1) {}", 1, [{ name: "param2" }], "function identifier(param1, param2) {}");
        });

        it("should insert in the middle", () => {
            doTest("function identifier(param1, param3) {}", 1, [{ name: "param2" }], "function identifier(param1, param2, param3) {}");
        });
    });

    describe(nameof<FunctionDeclaration>(n => n.fill), () => {
        function doTest(startingCode: string, structure: ParameteredNodeStructure, expectedCode: string) {
            const {firstChild, sourceFile} = getInfoFromText<FunctionDeclaration>(startingCode);
            firstChild.fill(structure);
            expect(firstChild.getText()).to.equal(expectedCode);
        }

        it("should modify when setting", () => {
            doTest("function identifier() {}", { parameters: [{ name: "param" }] }, "function identifier(param) {}");
        });

        it("should not modify anything if the structure doesn't change anything", () => {
            doTest("function identifier() {}", {}, "function identifier() {}");
        });
    });
});

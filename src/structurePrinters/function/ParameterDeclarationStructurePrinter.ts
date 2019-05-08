import { CodeBlockWriter } from "../../codeBlockWriter";
import { NotImplementedError } from "../../errors";
import { ParameterDeclarationStructure, OptionalKind } from "../../structures";
import { NodePrinter } from "../NodePrinter";
import { CommaSeparatedStructuresPrinter } from "../formatting";

export class ParameterDeclarationStructurePrinter extends NodePrinter<OptionalKind<ParameterDeclarationStructure>> {
    private readonly multipleWriter = new CommaSeparatedStructuresPrinter(this);

    printTexts(writer: CodeBlockWriter, structures: ReadonlyArray<OptionalKind<ParameterDeclarationStructure>> | undefined) {
        if (structures == null || structures.length === 0)
            return;
        this.multipleWriter.printText(writer, structures);
    }

    protected printTextInternal(writer: CodeBlockWriter, structure: OptionalKind<ParameterDeclarationStructure>) {
        if (structure.name == null)
            throw new NotImplementedError("Not implemented scenario where parameter declaration structure doesn't have a name. Please open an issue if you need this.");

        this.factory.forDecorator().printTextsInline(writer, structure.decorators);

        writer.withQueuedIndentationLevel(writer.getIndentationLevel() + 1, () => {
            this.factory.forModifierableNode().printText(writer, structure);
            writer.conditionalWrite(structure.isRestParameter, "...");
            writer.write(structure.name);
            writer.conditionalWrite(structure.hasQuestionToken, "?");
            this.factory.forTypedNode(":", structure.hasQuestionToken).printText(writer, structure);
            this.factory.forInitializerExpressionableNode().printText(writer, structure);
        });
    }
}

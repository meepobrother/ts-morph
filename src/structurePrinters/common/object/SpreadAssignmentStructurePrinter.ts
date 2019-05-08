import { CodeBlockWriter } from "../../../codeBlockWriter";
import { SpreadAssignmentStructure, OptionalKind } from "../../../structures";
import { printTextFromStringOrWriter } from "../../../utils";
import { NodePrinter } from "../../NodePrinter";

export class SpreadAssignmentStructurePrinter extends NodePrinter<OptionalKind<SpreadAssignmentStructure>> {
    protected printTextInternal(writer: CodeBlockWriter, structure: OptionalKind<SpreadAssignmentStructure>) {
        writer.withQueuedIndentationLevel(writer.getIndentationLevel() + 1, () => {
            writer.write("...");
            printTextFromStringOrWriter(writer, structure.expression);
        });
    }
}

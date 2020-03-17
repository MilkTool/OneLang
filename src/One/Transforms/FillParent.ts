import { SourceFile, Method, IInterface, Block } from "../Ast/Types";
import { Statement } from "../Ast/Statements";
import { Expression } from "../Ast/Expressions";
import { AstTransformer } from "../AstTransformer";

export class FillParent extends AstTransformer {
    name = "FillAttributesFromTrivia";
    parentExpr: Expression = null;

    protected visitExpression(expr: Expression) {
        expr.parentExpr = this.parentExpr;
        this.parentExpr = expr;
        super.visitExpression(expr);
        this.parentExpr = null;
        return null;
    }

    protected processMethod(method: Method, parent: IInterface) {
        method.parentInterface = parent;
        for (const param of method.parameters)
            param.parentMethod = method;
        super.visitMethod(method);
    }

    public visitSourceFile(file: SourceFile) {
        for (const imp of file.imports)
            imp.parentFile = file;

        for (const enum_ of file.enums.values()) {
            enum_.parentFile = file;
            for (const value of enum_.values.values())
                value.parentEnum = enum_;
        }

        for (const intf of file.interfaces.values()) {
            intf.parentFile = file;
            for (const method of intf.methods.values())
                this.processMethod(method, intf);
        }

        for (const cls of file.classes.values()) {
            cls.parentFile = file;

            if (cls.constructor_) {
                cls.constructor_.parentClass = cls;
                super.visitConstructor(cls.constructor_);
            }

            for (const method of cls.methods.values())
                this.processMethod(method, cls);

            for (const field of cls.fields.values())
                field.parentClass = cls;

            for (const prop of cls.properties.values()) {
                prop.parentClass = cls;
                if (prop.getter)
                    this.visitBlock(prop.getter);
                if (prop.setter)
                    this.visitBlock(prop.setter);
            }
        }
    }
}
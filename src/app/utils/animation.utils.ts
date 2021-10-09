declare var $: any;

export class AnimationUtils {
    static tabLoop() {
        $(function () {
            $(document).on(
                "keydown",
                ".tabloop :tabbable:not([readonly])",
                function (e) {
                    // Tab key only (code 9)
                    if (e.keyCode != 9) return;

                    // Get the loop element
                    var loop = $(this).closest(".tabloop");

                    // Get the first and last tabbable element
                    var firstTabbable = loop
                        .find(":tabbable:not([readonly])")
                        .first();
                    var lastTabbable = loop
                        .find(":tabbable:not([readonly])")
                        .last();

                    // Leaving the first element with Tab : focus the last one
                    if (firstTabbable.is(e.target) && e.shiftKey == true) {
                        e.preventDefault();
                        lastTabbable.focus();
                    }

                    // Leaving the last element with Tab : focus the first one
                    if (lastTabbable.is(e.target) && e.shiftKey == false) {
                        e.preventDefault();
                        firstTabbable.focus();
                    }
                }
            );
        });
    }

    static focusFirstInput() {
        let firstInp = $(".tabloop").find("input:first");
        let firstInvalidInp = $(".tabloop").find(".is-invalid:first");
        if (firstInvalidInp) {
            console.log("invalid");
            setTimeout(() => {
                firstInvalidInp.focus();
            }, 100);
        } else {
            setTimeout(() => {
                firstInp.focus();
            }, 100);
        }
    }

    static focusFirstInputModalWhenEror(){
        $(".modal").find(".is-invalid:first").focus()
    }

    // focus fisrt input when open modal
    static focusFirstInputOnShowModal() {
        $(".modal").on("shown.bs.modal", function () {
            $(".modal").find(".form-control")[0].focus()
        })
    }

    static checkReloadPage() {
        $(window).bind("beforeunload", function () {
            if (
                AnimationUtils.checkEmptyForm() &&
                $("#is-submitted").val() == "0"
            ) {
                return "WARNING: Data you have entered may not be saved.";
            }
        });
    }

    static checkCloseModal() {
        $(".modal").on("hide.bs.modal", function (e) {
            if (  AnimationUtils.checkEmptyForm() && $("#is-submitted").val() == "0"  ) {
                if (confirm("Are you sure, you want to close?")) {
                    $("form")[0].reset(); // clear form
                    $("#is-submitted").val() == "1";
                    return true;
                } else return false;
            }
        });
    }

    // check form is empty
    static checkEmptyForm() {
        let flag = false;
        $("form input").each(function () {
            if ($(this).val() != "" ) {
                flag = true;
            }
        });
        $("form select option:selected").each(function () {
            if ($(this).val() != "0: null" ) {
                flag = true;
            }
        });
        return flag;
    }

    static closeModalAfterSubmit() {
        $("#is-submitted").val("1");
        $(".modal").modal("hide");
    }
}

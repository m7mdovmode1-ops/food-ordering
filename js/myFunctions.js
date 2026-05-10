$(document).ready(function () {

    // ===== إظهار / إخفاء التفاصيل =====
    $('.details-btn').click(function () {
        var id = $(this).data('id');
        var detailsRow = $('#details-' + id);
        var content = detailsRow.find('.details-content');

        if (content.is(':visible')) {
            content.slideUp(200);
            $(this).text('إظهار');
        } else {
            content.slideDown(200);
            $(this).text('إخفاء');
        }
    });

    // ===== زر متابعة =====
    $('#continueBtn').click(function () {
        var checked = $('.meal-checkbox:checked');
        if (checked.length === 0) {
            alert('يرجى اختيار وجبة واحدة على الأقل');
            return;
        }

        // إظهار ملخص الوجبات المختارة
        var summaryHtml = '<p><strong>الوجبات المختارة:</strong></p><ul>';
        checked.each(function () {
            summaryHtml += '<li>' + $(this).data('name') + ' - ' + Number($(this).data('price')).toLocaleString() + ' ل.س</li>';
        });
        summaryHtml += '</ul>';
        $('#selectedMealsSummary').html(summaryHtml);

        // إظهار النموذج والتمرير إليه
        $('#orderFormSection').slideDown(300);
        $('html, body').animate({ scrollTop: $('#orderFormSection').offset().top - 20 }, 500);
    });

    // ===== إعادة تعيين النموذج =====
    $('#resetFormBtn').click(function () {
        $('#fullName, #nationalId, #birthDate, #mobile, #email').val('');
        $('.error-msg').hide();
        $('input, select, textarea').removeClass('error');
    });

    // ===== التحقق من المدخلات والإرسال =====
    $('#submitBtn').click(function () {
        var valid = true;

        // --- الاسم (عربي فقط، يمكن أن يكون فارغاً) ---
        var name = $('#fullName').val().trim();
        if (name !== '' && !/^[\u0600-\u06FF\s]+$/.test(name)) {
            $('#nameErr').show();
            $('#fullName').addClass('error');
            valid = false;
        } else {
            $('#nameErr').hide();
            $('#fullName').removeClass('error');
        }

        // --- الرقم الوطني (واجب، 11 خانة، أول خانتين 01-14) ---
        var nid = $('#nationalId').val().trim();
        var validPrefixes = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14'];
        var nidPrefix = nid.substring(0, 2);
        if (!/^\d{11}$/.test(nid) || validPrefixes.indexOf(nidPrefix) === -1) {
            $('#idErr').show();
            $('#nationalId').addClass('error');
            valid = false;
        } else {
            $('#idErr').hide();
            $('#nationalId').removeClass('error');
        }

        // --- تاريخ الولادة (اختياري، لكن إذا أُدخل يجب أن يكون صحيحاً) ---
        var birth = $('#birthDate').val();
        if (birth !== '') {
            var birthDate = new Date(birth);
            var today = new Date();
            if (isNaN(birthDate.getTime()) || birthDate >= today) {
                $('#birthErr').show();
                $('#birthDate').addClass('error');
                valid = false;
            } else {
                $('#birthErr').hide();
                $('#birthDate').removeClass('error');
            }
        } else {
            $('#birthErr').hide();
            $('#birthDate').removeClass('error');
        }

        // --- رقم الموبايل (اختياري) Syriatel: 0933,0932,0931,0930,0994,0995,0999 / MTN: 0966,0968,0961 ---
        var mobile = $('#mobile').val().trim();
        var mobileRegex = /^(0933|0932|0931|0930|0994|0995|0999|0966|0968|0961)\d{6}$/;
        if (mobile !== '' && !mobileRegex.test(mobile)) {
            $('#mobileErr').show();
            $('#mobile').addClass('error');
            valid = false;
        } else {
            $('#mobileErr').hide();
            $('#mobile').removeClass('error');
        }

        // --- الإيميل (اختياري) ---
        var email = $('#email').val().trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email !== '' && !emailRegex.test(email)) {
            $('#emailErr').show();
            $('#email').addClass('error');
            valid = false;
        } else {
            $('#emailErr').hide();
            $('#email').removeClass('error');
        }

        if (!valid) return;

        // ===== بناء نافذة النتيجة =====
        var checked = $('.meal-checkbox:checked');
        var total = 0;
        var mealsRows = '';

        checked.each(function () {
            var price = Number($(this).data('price'));
            total += price;
            mealsRows += '<tr><td>' + $(this).data('name') + '</td><td>' + price.toLocaleString() + ' ل.س</td></tr>';
        });

        var tax = total * 0.05;
        var finalTotal = total - tax;

        var popupHtml = '';

        if (name) popupHtml += '<p><strong>الاسم:</strong> ' + name + '</p>';
        popupHtml += '<p><strong>الرقم الوطني:</strong> ' + nid + '</p>';
        if (birth) popupHtml += '<p><strong>تاريخ الولادة:</strong> ' + birth + '</p>';
        if (mobile) popupHtml += '<p><strong>رقم الموبايل:</strong> ' + mobile + '</p>';
        if (email) popupHtml += '<p><strong>الإيميل:</strong> ' + email + '</p>';

        popupHtml += '<table class="popup-meals-table">';
        popupHtml += '<thead><tr><th>الوجبة</th><th>السعر</th></tr></thead>';
        popupHtml += '<tbody>' + mealsRows + '</tbody>';
        popupHtml += '<tfoot>';
        popupHtml += '<tr class="total-row"><td>المجموع قبل الضريبة</td><td>' + total.toLocaleString() + ' ل.س</td></tr>';
        popupHtml += '<tr><td>ضريبة 5%</td><td>- ' + tax.toLocaleString() + ' ل.س</td></tr>';
        popupHtml += '<tr class="total-row"><td>المجموع النهائي</td><td>' + finalTotal.toLocaleString() + ' ل.س</td></tr>';
        popupHtml += '</tfoot></table>';

        $('#popupBody').html(popupHtml);
        $('#resultPopup').removeClass('hidden');
    });

    // ===== إغلاق النافذة =====
    $('#closePopup').click(function () {
        $('#resultPopup').addClass('hidden');
    });

    $('#resultPopup').click(function (e) {
        if ($(e.target).attr('id') === 'resultPopup') {
            $('#resultPopup').addClass('hidden');
        }
    });

});

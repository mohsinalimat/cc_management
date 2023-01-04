function readable_date(date_str) {
	return new Date(date_str).toLocaleDateString('es-ES', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		timeZone: 'utc'
	})
}

// TODO ADD PAYMENT DAYS AFTER

frappe.ui.form.on('Credit Card Tool', {

	refresh: function (frm) {
		// If Usage Day is before today, set as today
		frm.trigger('amount');
	},

	amount: function (frm) {
		let credit_cards = [...frm.doc.credit_cards].sort((a,b) =>
			a.credit_limit <= b.credit_limit || Date.parse(b.due_date) - Date.parse(a.due_date)
		);  // Ordering Cards by Credit Limit and Cut Off

		frm.fields_dict['results'].$wrapper.html(
			frappe.render_template('credit_cards_options', {doc: frm.doc, cards: credit_cards})
		);

	}
});

// FIXME: Validate is no less than 0 and no more than 31
// FIXME: What if dates are 31th and next month has not 31th, Must go forward or backwards?
frappe.ui.form.on('Credit Card', {
	cut_off_day: function (frm, cdt, cdn) {  // Cut off happens regardless is weekday or a weekend
		let card = locals[cdt][cdn];

		card.cut_off = moment().date(card.cut_off_day).format(); // Date Of Current Month

		if (moment().date() > card.cut_off_day) {  // 'Cut Off Day' has passed -> Calculate the next month
			card.cut_off = frappe.datetime.add_months(card.cut_off, 1);
		}

		refresh_field('cut_off', cdn, 'credit_cards');
	},
	due_date_day: function (frm, cdt, cdn) {
		let card = locals[cdt][cdn];

		card.due_date = moment().date(card.due_date_day).format(); // Date Of Current Month

		if (card.due_date_day < card.cut_off_day) { // If "Due Date" is less than "Cut Off Date" its next month
			card.due_date = frappe.datetime.add_months(card.due_date, 1);
		}

		if (moment(card.due_date).isoWeekday() === 7) { // It's Sunday we add an extra day
			card.due_date = frappe.datetime.add_days(card.due_date, 1);
		}
	}
}) // 53
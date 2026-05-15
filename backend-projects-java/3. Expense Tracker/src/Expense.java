public class Expense {

    private int id;
    private String description;
    private double amount;
    private String createdAt;

    public Expense(
            int id,
            String description,
            double amount,
            String createdAt) {

        this.id = id;
        this.description = description;
        this.amount = amount;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public double getAmount() {
        return amount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

}
package hac.javareact;
import java.io.Serializable;
import java.util.Objects;

// the Score class record with a userName and a score value.
public class Score implements Serializable, Comparable<Score> {
    private String userName;
    private int score;

    // constructor
    public Score(String userName, int score) {
        this.userName = userName;
        this.score = score;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    //returns the hash code of the objects based on the userName and score.
    public int hashCode() {
        return Objects.hash(userName, score);
    }

    //compares two Score objects based on their score value.
    public int compareTo(Score other) {
        return Integer.compare(this.score, other.score);
    }

    // checks if two objects are equal based on their userName and score.
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Score other = (Score) obj;
        return score == other.score && Objects.equals(userName, other.userName);
    }
}




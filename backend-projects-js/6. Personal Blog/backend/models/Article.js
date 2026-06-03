import mongoose from "mongoose";
import slugify from "slugify";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
      index: true,
    },

    slug: {
      type: String,

      unique: true,

      lowercase: true,

      index: true,
    },

    content: {
      type: [Object],

      required: true,

      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },

        message: "Content blocks are required",
      },
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    likes: {
      type: [mongoose.Schema.Types.ObjectId],

      ref: "User",

      default: [],
    },

    dislikes: {
      type: [mongoose.Schema.Types.ObjectId],

      ref: "User",

      default: [],
    },

    views: {
      type: Number,

      default: 0,
    },
    status: {
      type: String,

      enum: ["draft", "published", "archived"],

      default: "draft",

      index: true,
    },
    readingTime: {
      type: String,

      default: "1 min read",
    },

    publishedAt: {
      type: Date,

      default: null,
    },
  },

  {
    timestamps: true,
    toJSON: {
      transform: (
        doc,

        ret,
      ) => {
        delete ret.__v;

        return ret;
      },
    },
  },
);

articleSchema.index({
  title: "text",

  "content.text": "text",

  category: "text",

  tags: "text",
});

const calculateReadingTime = (content) => {
  const text = content

    .map((block) => block.text || block.content || "")

    .join(" ");

  const wordCount = text.trim().split(/\s+/).length;

  const minutes = Math.max(
    1,

    Math.ceil(wordCount / 200),
  );

  return `${minutes} min read`;
};

articleSchema.pre(
  "save",

  async function () {
    if (this.isModified("title")) {
      let baseSlug = slugify(this.title, {
        lower: true,

        strict: true,
      });

      let slug = baseSlug;

      let count = 1;

      while (
        await mongoose.models.Article.findOne({
          slug,
          _id: {
            $ne: this._id,
          },
        })
      ) {
        slug = `${baseSlug}-${count}`;

        count++;
      }

      this.slug = slug;
    }

    if (this.isModified("content")) {
      this.readingTime = calculateReadingTime(this.content);

      const plainText = this.content
        .filter((block) => block.type === "paragraph")
        .map((block) => block.text || "")
        .join(" ");

      this.excerpt =
        plainText.length > 180 ? plainText.slice(0, 180) + "..." : plainText;
    }
  },
);
const Article = mongoose.model("Article", articleSchema);

export default Article;

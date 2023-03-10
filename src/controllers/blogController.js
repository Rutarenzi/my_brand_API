import Blog from  "../models/blogs";
import Comment from "../models/comments";
import blogSchema from "../validations/validateBlog";


export class BlogController{

    // display all blogs
    static async allBlogs(req,res){
        try{ 
            const blogs = await Blog.find();
            return res.status(200).send(blogs); 
               
        }catch(error){
           res.status(404).send(error);
        }
       
    }
    // add a blog
    static async createBlog(req,res){
        try{
        const {title,content} = req.body;
        const result = await blogSchema.validateAsync(req.body);
        
        const blog = new Blog({title,content,image:{url:req.file.path}});
        await blog.save();
        res.status(200).send(blog)
    }catch(error){
    res.send(error.message)
    }
    }
    // Read single blog
    static async readBlog(req,res){
        try{
            const blog = await Blog.findOne({_id:req.params.id})
            res.status(200).send(blog)
        } catch{
            res.status(404).send({error:"We can't find this Blog"})
        }
    }
    //upadte a single blog
    static async updateBlog(req,res){
        try{
            const blog = await Blog.findOne({_id: req.params.id})
            const {title,content} = req.body
            if(title){
                blog.title = title;
            }
            if(content){
                 blog.content=content;
            }
            blog.image.url =req.file.path;
            console.log(blog.image.url =req.file.path)
            await blog.save();
            res.status(200).send(blog)
        } catch{
            res.status(404).send({error: "this blog does not exist"})
        }

    }
    //delete the blog
    static async deleteBlog(req,res){
        try{
            await Blog.deleteOne({_id:req.params.id})
            res.status(204).send({error:"Blog deleted!!!!"})
        } catch{
            res.status(500).send({error:"Blog doesn't exist"})
        }
    }
    // comment to a blog
    static async commentBlog(req,res){
        try{
            const blog = await Blog.findOne({_id:req.params.id})
             
            const {name,content} = req.body
             const com = new Comment({
                name,
                content,
            })
            blog.comment.push(com);
            await blog.save();
            res.status(200).send(blog.comment);
           } catch{
            res.status(404).send({error: "the blog you try to comment to is delete"})
           }
    }

    //like blog a blog
    static async blogLiker(req,res){
        try{
            const blog = await Blog.findOne({_id:req.params.id});
            blog.likes++
            await blog.save();
            res.status(200).send(blog.likes)
        }catch{
                res.status(404).send({error:"the blog you are trying to like does not exist"})
        }
    }
   
}







